from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import random
from ideias import ideias_de_renda_extra

app = Flask(__name__)

# Código Mestre
CODIGO_MESTRE = "rendaextra500"

@app.route('/')
def landing_page():
    return render_template('landing_page.html')

@app.route('/acesso', methods=['POST'])
def acesso():
    cod_mestre_input = request.form.get('cod_mestre')
    if cod_mestre_input == CODIGO_MESTRE:
        return render_template('acesso_liberado.html')
    else:
        return render_template('landing_page.html', error="Código de acesso inválido.")

@app.route('/menu')
def menu():
    return render_template('acesso_liberado.html')

@app.route('/gerador')
def gerador_page():
    return render_template('index.html')

@app.route('/download-planilha')
def download_planilha():
    return send_from_directory('static', 'Planilha-de-Controle-Financeiro.xlsx', as_attachment=True)

@app.route('/videos')
def videos_page():
    return render_template('videos/videos_page.html')

@app.route('/video-planilha')
def video_planilha():
    return render_template('videos/video_planilha.html')

@app.route('/video-gerador')
def video_gerador():
    return render_template('videos/video_gerador.html')

@app.route('/ebook')
def ebook_home():
    return render_template('ebook/sumario.html')

@app.route('/ebook/introducao')
def ebook_introducao():
    return render_template('ebook/introducao.html')

@app.route('/ebook/capitulo-1')
def ebook_capitulo1():
    return render_template('ebook/capitulo_1.html')
    
@app.route('/ebook/capitulo-2')
def ebook_capitulo2():
    return render_template('ebook/capitulo_2.html')

@app.route('/ebook/capitulo-3')
def ebook_capitulo3():
    return render_template('ebook/capitulo_3.html')

@app.route('/ebook/capitulo-4')
def ebook_capitulo4():
    return render_template('ebook/capitulo_4.html')

@app.route('/ebook/capitulo-5')
def ebook_capitulo5():
    return render_template('ebook/capitulo_5.html')

@app.route('/ebook/conclusao')
def ebook_conclusao():
    return render_template('ebook/conclusao.html')

@app.route('/resultado', methods=['POST'])
def resultado():
    paixoes = request.form.getlist('paixao')
    habilidades = request.form.getlist('habilidade')
    conhecimento = request.form.get('conhecimento')
    ambientes = request.form.getlist('ambiente')

    sugestoes_agrupadas = {}

    for paixao in paixoes:
        for habilidade in habilidades:
            for ambiente in ambientes:
                paixao_data = ideias_de_renda_extra.get(paixao, {})
                habilidade_data = paixao_data.get(habilidade, {})
                
                conhecimento_data = habilidade_data.get(conhecimento, {})
                sugestoes = conhecimento_data.get(ambiente)
                
                if sugestoes:
                    chave = f'{paixao.capitalize()} - {habilidade.capitalize()} ({ambiente.capitalize()})'
                    if chave not in sugestoes_agrupadas:
                        sugestoes_agrupadas[chave] = []
                    sugestoes_agrupadas[chave].extend(sugestoes)
    
    if not sugestoes_agrupadas:
        fallback_sugestoes = []
        for paixao in paixoes:
            paixao_data = ideias_de_renda_extra.get(paixao, {})
            if paixao_data:
                for h in paixao_data.values():
                    for c in h.values():
                        for a in c.values():
                            fallback_sugestoes.extend(a)
        
        if fallback_sugestoes:
            sugestoes_agrupadas['Sugestões Ampliadas'] = list(dict.fromkeys(fallback_sugestoes))
            random.shuffle(sugestoes_agrupadas['Sugestões Ampliadas'])
            sugestoes_agrupadas['Sugestões Ampliadas'] = sugestoes_agrupadas['Sugestões Ampliadas'][:10]
        else:
            sugestoes_agrupadas['Nenhuma Sugestão'] = ["Não foi possível encontrar sugestões ideais para a sua combinação. Tente selecionar menos filtros ou explorar outras paixões."]

    return render_template('resultado.html', sugestoes_agrupadas=sugestoes_agrupadas)

if __name__ == '__main__':
    app.run(debug=True)