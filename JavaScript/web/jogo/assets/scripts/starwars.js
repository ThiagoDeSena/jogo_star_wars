const tela = document.getElementsByTagName('body')[0]
const game = new Game()
let nave

tela.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        (game.isPause())?game.start():game.pause('Pause')
        
    }else if(event.key == 'p'){
        game.pause('Pause')
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
            
        }
    }

    this.pause = (mensagem = '') => {
        painel.style.display = 'block'
        painelMsg.textContent = mensagem
        pause = true
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


    this.setXY = (x,y) => {
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
    
}

game.start()