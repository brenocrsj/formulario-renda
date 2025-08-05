document.addEventListener('DOMContentLoaded', () => {
    const ACCESS_CODE = "rendaextra500";
    
    // Lógica para a tela de acesso
    const accessScreen = document.getElementById('access-screen');
    if (accessScreen) {
        const accessCodeInput = document.getElementById('access-code-input');
        const accessButton = document.getElementById('access-btn');

        accessButton.addEventListener('click', () => {
            if (accessCodeInput.value === ACCESS_CODE) {
                window.location.href = "/menu";
            } else {
                alert("Código de acesso inválido.");
                accessCodeInput.value = '';
            }
        });
    }

    // Lógica do formulário de múltiplas etapas
    const form = document.getElementById('multi-step-form');
    if (!form) return;

    const formSteps = form.querySelectorAll('.form-step');
    let currentStep = 0;

    const updateButtons = () => {
        const nextBtn = formSteps[currentStep].querySelector('.next-btn');
        const prevBtn = formSteps[currentStep].querySelector('.prev-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (nextBtn) {
            nextBtn.disabled = !validateStep(currentStep);
        }
        if (submitBtn) {
            submitBtn.disabled = !validateStep(currentStep);
        }

        if (prevBtn) {
            prevBtn.style.display = (currentStep === 0) ? 'none' : 'block';
        }
    };

    const showStep = (stepIndex) => {
        formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        updateButtons();
    };

    const validateStep = (stepIndex) => {
        const currentStepElement = formSteps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input');
        
        let isValid = false;
        if (inputs.length > 0) {
            isValid = Array.from(inputs).some(input => input.checked || (input.type === 'text' && input.value.trim() !== ''));
        } else {
            isValid = true;
        }
        
        return isValid;
    };

    form.addEventListener('change', updateButtons);
    form.addEventListener('input', updateButtons); // Para campos de texto
    
    formSteps.forEach((step, index) => {
        const nextBtn = step.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep(index)) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        }
        
        const prevBtn = step.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentStep--;
                showStep(currentStep);
            });
        }
    });

    // Inicializa o formulário na primeira etapa
    showStep(currentStep);
});