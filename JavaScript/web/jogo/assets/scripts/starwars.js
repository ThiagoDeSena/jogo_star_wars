const tela = document.getElementsByTagName('body')[0]
const game = new Game()
let nave
let inimigos = []
const velocidademovimento = 5
const maxinimigos = 10
let intervalo

tela.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        (game.isPause())?game.start():game.pause('Pause')
        
    }else if(event.key == 'p'){
        game.pause('Pause')
    }
})

tela.addEventListener('keydown',function (event){
    if(!game.isPause()){
        if(event.key == 'ArrowLeft'){
            nave.setXY(nave.x() - velocidademovimento,nave.y)
        }else if(event.key == 'ArrowRight'){
            nave.setXY(nave.x() + velocidademovimento,nave.y)
        }
    }
    
})

function Game(){
    const painel = document.getElementById('painel')
    const placar = document.getElementById('placar')
    const painelMsg = painel.querySelector('.msg')
    let pause = true


    this.isPause = () => pause
    this.w = () => tela.getBoundingClientRect().width
    this.h = () => tela.getBoundingClientRect().height
    

    this.start = () => {
        painel.style.display = 'none'
        placar.style.display = 'flex'
        pause = false
        if(nave == undefined){
            nave = new Nave()
            for(let cont = 0;cont<maxinimigos;cont++){
                let imagem = 'cp1'
                switch(Math.round(Math.random()*2)){
                    case 1: imagem = 'iba'
                        break
                    case 2: imagem = 'iy'
                        break
                }
                inimigos.push(new Inimigo(imagem))
            }
        }
        intervalo = setInterval(() =>{
            inimigos.forEach(inimigo => {
                inimigo.animation()
            })
        } ,100)
    }

    this.pause = (mensagem = '') => {
        painel.style.display = 'block'
        painelMsg.textContent = mensagem
        pause = true
        clearInterval(intervalo)
    }
}

function Nave(imagem = 'wt'){
    // <div class="nave">
    //     <img src="assets/images/mf.png" alt="">
    // </div>
    let div = document.createElement('div')
    div.classList.add('nave')
    let i = document.createElement('img')
    i.src = `assets/images/${imagem}.png`
    div.appendChild(i)
    tela.appendChild(div)
    

    this.w = () => div.getBoundingClientRect().width
    this.h = () => div.getBoundingClientRect().height
    this.x = () => div.getBoundingClientRect().x
    this.y = () => div.getBoundingClientRect().y


    this.setXY = (x,y) => {
        if(x<0){
            x=0
        }else if(x>game.w()-this.w()){
            x=game.w() - this.w()
        }

        div.style.left = `${x}px`
        div.style.top = `${y}px`
    }

    
    

    let posicaoInicial = () => {
        this.setXY(
            game.w()/2 - this.w()/2,
            game.h() - this.h() - 10
            )
    }

    i.onload = posicaoInicial
    this.onload = (fn) => i.onload = fn
}

function Inimigo(imagem = 'cp1'){
    Nave.call(this,imagem)
    this.setPosicaoInicial = () => {
        let x = Math.round(Math.random() * (game.w()-this.w()))
        let y = Math.round(-this.h() - 10 - (Math.random() * 2000))
        // y = 50
        this.setXY(x,y)
    }

    this.animation = () => {
        this.setXY(this.x(),this.y() + velocidademovimento)
        if(this.y() > game.h()+20){
            this.setPosicaoInicial()
        }
    }

    this.onload(this.setPosicaoInicial)
}

game.start()