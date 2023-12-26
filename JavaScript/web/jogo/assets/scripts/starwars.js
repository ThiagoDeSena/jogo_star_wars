const tela = document.getElementsByTagName('body')[0]
const game = new Game()
let nave
const inimigos = []
const velocidade_movimento = 10
const max_inimigos = 10
const laser_aliados = []
const laser_inimigos = []
const aceleracao_laser = 3
const delay_lasers = 10
let intervalo

tela.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        (game.isPause())?game.start():game.pause('Pause')
        
    }else if(event.key == 'p'){
        game.pause('Pause')
    }

    if(!game.isPause()){
        if(event.key == ' '){
            nave.fire()
        }
    
        if(event.key == 'ArrowLeft' || event.key == 'ArrowRight'){
            nave.moveStop()
        }
    }
    
})

tela.addEventListener('keydown',function (event){
    if(!game.isPause()){
        if(event.key == 'ArrowLeft'){
            nave.moveLeft()
        }else if(event.key == 'ArrowRight'){
            nave.moveRigth()
        }
    }
    
})

function Game(){
    const painel = document.getElementById('painel')
    const placar = document.getElementById('placar')
    const painelMsg = painel.querySelector('.msg')
    let pause = true
    let pontuacao = 0

    this.isPause = () => pause
    this.w = () => tela.getBoundingClientRect().width
    this.h = () => tela.getBoundingClientRect().height
    

    this.start = () => {
        painel.style.display = 'none'
        placar.style.display = 'flex'
        pause = false
        if(nave == undefined){
            nave = new NaveJogador()
            for(let cont = 0;cont<max_inimigos;cont++){
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
            nave.animation()
            inimigos.forEach(inimigo => {
                inimigo.animation()
            })
            gerenciarLaser(laser_aliados)
            gerenciarLaser(laser_inimigos)
            let sorteio = Math.round(Math.random()*delay_lasers)
            console.log(sorteio)
            if(sorteio < inimigos.length){
                if(inimigos[sorteio].y()>0){
                    inimigos[sorteio].fire()
                }
            }
            gerenciarColisoes()
        } ,100)
    }

    this.pause = (mensagem = '') => {
        painel.style.display = 'block'
        painelMsg.textContent = mensagem
        pause = true
        nave.moveStop()
        clearInterval(intervalo)
    }

    this.gameOver = () => {
        this.pause('Game Over')
        tela.addEventListener('keyup', function(event){
            if(event.key == 'Enter'){
                location.reload()
            }
        })
    }

    this.pontuar = () => {
        pontuacao++
        placar.querySelector('span').textContent = pontuacao
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
    this.colisao = () => elemento.remove()
    
    this.remove = () => elemento.remove()

}


function Nave(imagem = 'wt'){
    
    let div = elemento('div','nave')
    Ovni.call(this,div)
    let i = document.createElement('img')
    i.src = `assets/images/${imagem}.png`
    div.appendChild(i)
    this.onload = (fn) => i.onload = fn

}

function NaveJogador(imagem = 'wt'){
    Nave.call(this,imagem)
    let deslocamento = 0
    let posicaoInicial = () => {
        this.setXY(
            game.w()/2 - this.w()/2,
            game.h() - this.h() - 10
            )
    }
    this.onload(posicaoInicial)
    this.fire = () =>{
        laser = new Laser()
        let x = this.x() + this.w()/2 - laser.w()/2
        let y = this.y() - laser.h() - 1
        laser.setXY(x,y)
        laser_aliados.push(laser)
    }
    //parado 0
    this.moveStop = () => deslocamento = 0
    this.moveLeft = () => deslocamento = -1
    this.moveRigth = () => deslocamento = 1
    //esquerda - 1
    //direita + 1
    this.animation = () => {
        this.setXY(
            this.x() + velocidade_movimento * deslocamento 
            ,
            this.y())
    }

    this.colisao = () => game.gameOver()
}

function Inimigo(imagem = 'cp1'){
    Nave.call(this,imagem)
    this.setPosicaoInicial = () => {
        let x = Math.round(Math.random() * (game.w()-this.w()))
        let y = Math.round(-this.h() - 10 - (Math.random() * 2000))
        //y = 0
        this.setXY(x,y)
    }

    this.animation = () => {
        this.setXY(this.x(),this.y() + velocidade_movimento)
        if(this.y() > game.h()+20){
            this.setPosicaoInicial()
        }
    }

    this.fire = () =>{
        laser = new Laser(1)
        let x = this.x() + this.w()/2 - laser.w()/2
        let y = this.y() + this.h() + 1
        laser.setXY(x,y)
        laser_inimigos.push(laser)
    }

    this.onload(this.setPosicaoInicial)
    this.colisao = () => {
        this.setPosicaoInicial()
        game.pontuar()
    }
}

function elemento(tag,classe){
    let elemento = document.createElement(tag)
    elemento.classList.add(classe)
    tela.appendChild(elemento)
    return elemento

}

function Laser(inimigo = false){
    // <div class="laser inimigo"></div>
    let div = elemento('div','laser')
    let deslocamento = -1
    Ovni.call(this,div)
    if(inimigo){
        div.classList.add('inimigo')
        deslocamento = 1
    }

    this.animation = () => {
        this.setXY(this.x(),this.y()+velocidade_movimento*aceleracao_laser*deslocamento)
    }
    
}

function gerenciarLaser(lasers){
    lasers.forEach((item,index,lista) => {
        item.animation()
        if(item.y()>game.h()+10 || item.y()+item.h()+10 < 0){
            item.remove()
            lista.splice(index, 1)
        }
    })
}

function gerenciarColisoes(){
    let colisao = function(obj1,obj2){
        let x = obj1.x() <= obj2.x() + obj2.w()
            && obj1.x() + obj1.w() >= obj2.x()
        let y = obj1.y() <= obj2.y() + obj2.h()
            && obj1.y() + obj1.h() >= obj2.y()
        console.log(`x:${x}`,`y:${y}`)
        if(x && y){
            obj1.colisao()
            obj2.colisao()
            return true
        }
        return false
    }

    inimigos.forEach((inimigo, ii, inimigos) => {
        laser_aliados.forEach((laser,il, lasers) =>{
            if(colisao(inimigo, laser)){
                lasers.splice(il, 1)
            }
        })
        colisao(nave, inimigo)
    })

    laser_inimigos.forEach((laser) => {
        colisao(nave,laser)
    })

    
    colisao(nave, inimigos[0])
}

game.start()