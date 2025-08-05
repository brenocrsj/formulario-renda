document.addEventListener('DOMContentLoaded', () => {
    const ACCESS_CODE = "rendaflex.br";
    
    const accessScreen = document.getElementById('access-screen');
    const accessCodeInput = document.getElementById('access-code-input');
    const accessButton = document.getElementById('access-btn');
    const multiStepForm = document.getElementById('multi-step-form');

    // Lógica da tela de acesso
    accessButton.addEventListener('click', () => {
        if (accessCodeInput.value === ACCESS_CODE) {
            accessScreen.style.display = 'none';
            multiStepForm.style.display = 'block';
            multiStepForm.classList.add('active');
        } else {
            alert("Código de acesso incorreto. Tente novamente.");
            accessCodeInput.value = '';
        }
    });

    // Lógica do formulário de múltiplas etapas
    const formSteps = multiStepForm.querySelectorAll('.form-step');
    const nextButtons = multiStepForm.querySelectorAll('.next-btn');
    const prevButtons = multiStepForm.querySelectorAll('.prev-btn');
    const submitButton = document.getElementById('submit-btn');

    let currentStep = 0;

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
    }

    function validateStep(stepIndex) {
        let isValid = false;
        const currentStepElement = formSteps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input');
        
        if (inputs.length > 0) {
            isValid = Array.from(inputs).some(input => input.checked);
        }
        
        return isValid;
    }

    // Lógica para os botões "Próximo"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Lógica para os botões "Voltar"
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Lógica para habilitar/desabilitar botões "Próximo" e "Enviar"
    multiStepForm.addEventListener('change', (event) => {
        const nextBtn = formSteps[currentStep].querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.disabled = !validateStep(currentStep);
        }

        // Habilitar o botão de enviar apenas no último passo e se for válido
        if (currentStep === formSteps.length - 1) {
            submitButton.disabled = !validateStep(currentStep);
        }
    });

    // Habilitar o botão "Próximo" inicial após o carregamento
    showStep(currentStep);
    multiStepForm.addEventListener('change', () => {
        const nextBtn = formSteps[currentStep].querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.disabled = !validateStep(currentStep);
        }
    });
});