class Game {
  constructor() {}

  //Obtem estado do jogo do banco de dados
  getState() {
    //passa a localizaçao do campo
    var gameStateRef = database.ref("gameState");
    //lê o valor do campo somente para gameState
    gameStateRef.on("value", function(data) {
      //salva na variável gameState
      gameState = data.val();
    });
  }

  //atualiza o gameState (cópia do updateCount)
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();//acrescentar a contagem de jogadores

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }

  //muda elementos
  handleElements() {
    //oculta o form quando está no modo de jogo
    form.hide();
    //muda posição do titulo
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements();//chamada função
    
    Player.getPlayersInfo();

    //exibir somente quando receber as informações do jogador
    //no inicio do código a variável allPlayers é indefinida
    if (allPlayers !== undefined) {
      //cria pista fora da tela (-height*5)
      //background("darkblue")
      image(track, 0, -height * 5, width+100, height * 6);

      
      //c38
      //índice da matriz
      var index = 0;
      //sintaxe diferente: for(variavel in objeto)
      for (var plr in allPlayers) {
        index += 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;//jogador na parte inferior da tela

        //posição também para os carros
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;



        //criação circulo no carro em foco
        if (index === player.index) {
          stroke("blue");
          fill("red");
          ellipse(x, y, 60, 60);

          //alinha a posição da câmera com a do carro
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }

      this.handlePlayerControls();

      drawSprites();
    }
  }


  // manipulando eventos de teclado 
  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      //atualiza no BD
      player.update();
    }
  }
}
