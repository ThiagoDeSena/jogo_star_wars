const tela = document.getElementsByTagName('body')[0]
const game = new Game()
let nave
const inimigos = []
const velocidademovimento = 10
const maxinimigos = 0
const laser_aliados = []
let intervalo

tela.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        (game.isPause())?game.start():game.pause('Pause')
        
    }else if(event.key == 'p'){
        game.pause('Pause')
    }

    if(event.key == ' '){
        nave.fire()
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

function Ovni(elemento){
    
    this.w = () => elemento.getBoundingClientRect().width
    this.h = () => elemento.getBoundingClientRect().height
    this.x = () => elemento.getBoundingClientRect().x
    this.y = () => elemento.getBoundingClientRect().y


    this.setXY = (x,y) => {
        if(x<0){
            x=0
        }else if(x>game.w()-this.w()){
            x=game.w() - this.w()
        }

        elemento.style.left = `${x}px`
        elemento.style.top = `${y}px`
    }

}


function Nave(imagem = 'wt'){
    
    let div = elemento('div','nave')
    Ovni.call(this,div)
    let i = document.createElement('img')
    i.src = `assets/images/${imagem}.png`
    div.appendChild(i)
    


    let posicaoInicial = () => {
        this.setXY(
            game.w()/2 - this.w()/2,
            game.h() - this.h() - 10
            )
    }

    i.onload = posicaoInicial
    this.onload = (fn) => i.onload = fn

}

function NaveJogador(imagem = 'wt'){
    Nave.call(this,imagem)
    this.fire = () =>{
        laser = new Laser()
        let x = this.x() + this.w()/2 - laser.w()/2
        let y = this.y() - laser.h() - 1
        laser.setXY(x,y)
        laser_aliados.push(laser)
    }
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

function elemento(tag,classe){
    let elemento = document.createElement(tag)
    elemento.classList.add(classe)
    tela.appendChild(elemento)
    return elemento

}

function Laser(){
    // <div class="laser inimigo"></div>
    let div = elemento('div','laser')
    Ovni.call(this,div)
}

game.start()