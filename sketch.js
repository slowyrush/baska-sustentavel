/*

Controles:
ENTER = iniciar
MOUSE = mirar
CLIQUE = arremessar
L = loja
ESC = voltar
R = reiniciar
*/

let estado = "tutorial";

let tipos = [
  { nome: "PAPEL", cor: "#2F80ED", emoji: "📄" },
  { nome: "PLÁSTICO", cor: "#EB5757", emoji: "🥤" },
  { nome: "METAL", cor: "#F2C94C", emoji: "🥫" },
  { nome: "VIDRO", cor: "#27AE60", emoji: "🍾" }
];

let skins = [
  { nome: "Clássico", camisa: "#FFFFFF", short: "#111111", cabelo: "#111111", preco: 0, ok: true },
  { nome: "Neon", camisa: "#00F5FF", short: "#151515", cabelo: "#004CFF", preco: 35, ok: false },
  { nome: "Fogo", camisa: "#FF6B00", short: "#2A0800", cabelo: "#FFD000", preco: 70, ok: false },
  { nome: "Lenda", camisa: "#FF00CC", short: "#181140", cabelo: "#FFFFFF", preco: 120, ok: false }
];

let skinAtual = 0;

let bins = [];
let lixo;
let particulas = [];
let textosFlutuantes = [];

let pontos = 0;
let moedas = 0;
let fase = 1;
let combo = 0;
let comboTimer = 0;
let melhorPontuacao = 0;

let playerX = 145;
let playerY = 555;

let bossVida = 20;
let bossVidaMax = 20;

let shake = 0;
let tempo = 60 * 90;
let vento = 0;

function setup() {
  createCanvas(1200, 700);
  textAlign(CENTER, CENTER);
  rectMode(CORNER);

  melhorPontuacao = Number(localStorage.getItem("recicla_best") || 0);
  moedas = Number(localStorage.getItem("recicla_moedas") || 0);

  resetarJogo();
}

function draw() {
  aplicarShake();
  desenharFundo();

  if (estado === "tutorial") telaTutorial();
  if (estado === "menu") telaMenu();
  if (estado === "jogo") jogo();
  if (estado === "loja") telaLoja();
  if (estado === "boss") telaBoss();
  if (estado === "gameover") telaGameOver();
}

function resetarJogo() {
  pontos = 0;
  fase = 1;
  combo = 0;
  comboTimer = 0;
  tempo = 60 * 90;
  particulas = [];
  textosFlutuantes = [];
  criarLixeiras();
  novoLixo();
}

function aplicarShake() {
  if (shake > 0.2) {
    translate(random(-shake, shake), random(-shake, shake));
    shake *= 0.86;
  }
}

function desenharFundo() {
  if (fase < 4) background("#5DCAFF");
  else if (fase < 8) background("#FFB347");
  else if (fase < 12) background("#2C3E50");
  else background("#25164A");

  noStroke();

  fill(255, 220);
  nuvem(180, 115, 1);
  nuvem(790, 85, 1.2);
  nuvem(990, 170, 0.9);

  fill(30, 80, 140, 80);
  for (let x = 0; x < width; x += 70) {
    let h = 120 + ((x * 13) % 120);
    rect(x, 420 - h, 45, h);
  }

  fill("#6B7078");
  rect(0, 570, width, 130);

  fill("#33383F");
  rect(0, 625, width, 75);

  stroke(85);
  strokeWeight(2);
  for (let x = 0; x < width; x += 80) {
    line(x, 625, x + 42, 625);
  }
}

function nuvem(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  ellipse(0, 0, 85, 35);
  ellipse(45, 0, 95, 40);
  ellipse(-40, 5, 70, 30);
  pop();
}

// ================= MENU =================


function telaTutorial() {
  painelEscuro();

  fill(255);
  textSize(58);
  text("COMO JOGAR", width / 2, 90);

  fill("#FFD166");
  textSize(24);
  text("Recicle o lixo corretamente e faça combos absurdos 😎", width / 2, 145);

  fill(20, 25, 35, 235);
  stroke("#FFFFFF");
  strokeWeight(3);
  rect(width / 2 - 420, 190, 840, 360, 25);

  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);

  textSize(28);
  text("🎯 Mire com o mouse", width / 2 - 360, 250);
  text("🖱 Clique para arremessar", width / 2 - 360, 305);
  text("♻ Acerte a lixeira correta", width / 2 - 360, 360);
  text("🔥 Faça combos para ganhar mais pontos", width / 2 - 360, 415);
  text("👹 Derrote bosses para avançar", width / 2 - 360, 470);

  textAlign(CENTER, CENTER);

  botaoVisual(width / 2 - 160, 560, 320, 60, "MENU");

  personagem(width - 180, 620, true, skinAtual, 0.9);
}
function telaMenu() {
  painelEscuro();

  fill(255);
  textSize(64);
  text("RECICLA BASKA ELITE", width / 2, 120);

  textSize(22);
  fill("#FFD166");
  text("Recicle, mire e domine as quadras ecológicas!", width / 2, 175);

  botaoVisual(120, 250, 320, 55, "ENTER - JOGAR");
  botaoVisual(120, 320, 320, 55, "L - LOJA");
  botaoVisual(120, 390, 320, 55, "MOUSE - MIRAR");
  botaoVisual(120, 460, 320, 55, "CLIQUE - ARREMESSAR");

  fill(255);
  textSize(20);
  text("Melhor pontuação: " + melhorPontuacao, width / 2, 545);

  personagem(width - 170, 620, true, skinAtual, 0.9);
}

function telaLoja() {
  painelEscuro();

  fill(255);
  textSize(56);
  text("LOJA DE SKINS", width / 2, 80);

  textSize(24);
  fill("#FFD166");
  text("Moedas: " + moedas, width / 2, 130);

  for (let i = 0; i < skins.length; i++) {
    let x = 110 + i * 275;

    fill(20, 25, 35, 235);
    stroke(i === skinAtual ? "#FFD166" : "#FFFFFF");
    strokeWeight(i === skinAtual ? 5 : 2);
    rect(x, 190, 230, 380, 22);

    noStroke();
    fill(255);
    textSize(25);
    text(skins[i].nome, x + 115, 235);

    personagem(x + 115, 510, false, i, 0.72);

    textSize(18);
    fill(skins[i].ok ? "#7CFF7C" : "#FFFFFF");
    text(skins[i].ok ? "Desbloqueada" : "Preço: " + skins[i].preco, x + 115, 285);

    fill("#FFD166");
    text("Tecla " + (i + 1), x + 115, 315);
  }

  fill(255);
  textSize(20);
  text("ESC - Voltar", width / 2, 655);
}


function jogo() {
  atualizarJogoBase();
  hud();
  desenharLixeiras();
  personagem(playerX, playerY, true, skinAtual);
  painelMouse();

  if (!lixo.jogado) trajetoriaMouse();

  lixo.update();
  lixo.show();

  colisaoLixeiras();
  atualizarParticulas();
  atualizarTextos();

  tempo--;
  if (tempo <= 0) finalizarJogo();

  if (pontos > 0 && pontos % 25 === 0 && estado === "jogo") iniciarBoss();
}

function atualizarJogoBase() {
  vento = sin(frameCount * 0.01 + fase) * (0.015 * fase);

  if (comboTimer > 0) comboTimer--;
  else combo = 0;
}

function iniciarBoss() {
  estado = "boss";
  bossVidaMax = 14 + fase * 3;
  bossVida = bossVidaMax;
  novoLixo();
}


function telaBoss() {
  background("#201018");

  fill(255);
  textSize(46);
  text("BOSS: MONSTRO DO LIXO", width / 2, 62);

  fill("#222");
  rect(width / 2 - 250, 105, 500, 30, 12);

  fill("#FF3333");
  let w = map(bossVida, 0, bossVidaMax, 0, 500);
  rect(width / 2 - 250, 105, w, 30, 12);

  fill(70);
  ellipse(950, 370, 230);

  textSize(95);
  text("👹", 950, 365);

  fill(255);
  textSize(18);
  text("Acerte qualquer lixo no boss!", 950, 500);

  personagem(playerX, playerY, true, skinAtual);
  painelMouse();

  if (!lixo.jogado) trajetoriaMouse();

  lixo.update();
  lixo.show();

  if (lixo.jogado && dist(lixo.x, lixo.y, 950, 370) < 115) {
    bossVida--;
    pontos += 2 + combo;
    moedas += 3;
    combo++;
    comboTimer = 160;

    explosao(lixo.x, lixo.y, "#FF3333", 45);
    textoFlutuante("+BOSS", lixo.x, lixo.y, "#FF3333");

    shake = 8;
    novoLixo();

    if (bossVida <= 0) {
      fase++;
      moedas += 40;
      textoFlutuante("BOSS DERROTADO +40", width / 2, 240, "#FFD166");
      estado = "jogo";
      novoLixo();
    }
  }

  atualizarParticulas();
  atualizarTextos();
}

function hud() {
  fill(15, 25, 38, 225);
  stroke(255);
  strokeWeight(2);
  rect(20, 20, 350, 160, 18);

  noStroke();
  fill(255);
  textSize(22);
  text("Fase: " + fase, 95, 55);
  text("Pontos: " + pontos, 112, 90);
  text("Moedas: " + moedas, 116, 125);

  fill("#FFD166");
  text("Combo x" + max(1, combo), 255, 90);

  fill("#7CFF7C");
  text("Tempo: " + ceil(tempo / 60), 250, 125);

  fill(15, 25, 38, 225);
  stroke(255);
  rect(width / 2 - 190, 20, 380, 85, 16);

  noStroke();
  fill(255);
  textSize(18);
  text("LIXO ATUAL", width / 2, 47);

  fill(lixo.tipo.cor);
  textSize(28);
  text(lixo.tipo.nome + " " + lixo.tipo.emoji, width / 2, 78);

  fill(255);
  textSize(16);
  text("Vento: " + nf(vento * 100, 1, 2), width - 100, 35);
}



function criarLixeiras() {
  bins = [];

  for (let i = 0; i < 4; i++) {
    bins.push({
      x: 600 + i * 140,
      y: 500,
      tipo: tipos[i],
      offset: random(TWO_PI)
    });
  }
}

function desenharLixeiras() {
  for (let b of bins) {
    let moveY = sin(frameCount * 0.025 + b.offset) * min(18, fase * 2);

    stroke(0);
    strokeWeight(4);

    fill(245);
    rect(b.x - 58, b.y - 150 + moveY, 116, 70, 12);

    fill(b.tipo.cor);
    rect(b.x - 48, b.y - 75 + moveY, 96, 95, 12);

    fill(b.tipo.cor);
    ellipse(b.x, b.y - 78 + moveY, 112, 30);

    fill(25);
    ellipse(b.x, b.y - 78 + moveY, 84, 14);

    noStroke();
    fill(b.tipo.cor);
    textSize(18);
    text(b.tipo.nome, b.x, b.y - 118 + moveY);

    fill(255);
    textSize(35);
    text("♻", b.x, b.y - 25 + moveY);

    stroke(0);
    strokeWeight(5);
    line(b.x, b.y + 20 + moveY, b.x, 570);
  }
}

function embaralharLixeiras() {
  for (let i = bins.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [bins[i].tipo, bins[j].tipo] = [bins[j].tipo, bins[i].tipo];
  }
}



function novoLixo() {
  lixo = {
    x: playerX + 100,
    y: playerY - 185,
    vx: 0,
    vy: 0,
    tipo: random(tipos),
    jogado: false,
    rot: 0,

    update() {
      if (!this.jogado) {
        this.x = playerX + 100;
        this.y = playerY - 185 + sin(frameCount * 0.12) * 2;
      } else {
        this.x += this.vx;
        this.y += this.vy;

        this.vx += vento;
        this.vy += 0.36;

        this.rot += 0.15;

        if (this.y > height + 80 || this.x > width + 100 || this.x < -100) {
          combo = 0;
          novoLixo();
        }
      }
    },

    show() {
      push();
      translate(this.x, this.y);
      rotate(this.rot);

      stroke(0);
      strokeWeight(3);
      fill(255);
      ellipse(0, 0, 44);

      noStroke();
      textSize(27);
      text(this.tipo.emoji, 0, 0);

      pop();
    }
  };
}



function personagem(x, y, animar = true, skinIndex = skinAtual, escala = 1) {
  let skin = skins[skinIndex];
  let armAnim = 0;
  let corpo = 0;

  if (animar) corpo = sin(frameCount * 0.08) * 2;
  if (lixo && lixo.jogado) armAnim = -38;
  else armAnim = map(constrain(mouseY, 100, height), 100, height, -25, 20);

  push();
  translate(x, y + corpo);
  scale(escala);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  noStroke();
  fill(0, 75);
  ellipse(20, 18, 150, 24);

  stroke(0);
  strokeWeight(5);
  fill("#F2C7A8");
  ellipse(0, -225, 60, 64);

  fill(skin.cabelo);
  noStroke();
  arc(0, -237, 62, 45, PI, TWO_PI);
  triangle(-26, -238, -12, -270, -2, -238);
  triangle(-8, -242, 5, -276, 14, -240);
  triangle(12, -240, 30, -262, 28, -232);

  fill(0);
  ellipse(-10, -228, 5);
  ellipse(10, -228, 5);

  noFill();
  stroke(0);
  strokeWeight(3);
  arc(0, -216, 22, 12, 0, PI);

  strokeWeight(5);
  line(0, -194, 0, -182);

  fill(skin.camisa);
  strokeWeight(5);
  beginShape();
  vertex(-30, -182);
  vertex(30, -182);
  vertex(40, -112);
  vertex(22, -92);
  vertex(-22, -92);
  vertex(-40, -112);
  endShape(CLOSE);

  noStroke();
  fill(0);
  textSize(24);
  text("7", 0, -137);

  stroke(0);
  strokeWeight(8);

  line(-25, -172, -60, -138);
  line(-60, -138, -42, -108);

  line(25, -172, 64, -198 + armAnim);
  line(64, -198 + armAnim, 100, -185 + armAnim);

  fill("#F2C7A8");
  strokeWeight(4);
  ellipse(104, -185 + armAnim, 16);

  fill(skin.short);
  strokeWeight(5);
  rect(-34, -96, 68, 42, 9);

  strokeWeight(9);
  line(-18, -55, -50, 0);
  line(18, -55, 55, 0);

  strokeWeight(10);
  line(-50, 0, -14, 0);
  line(55, 0, 92, 0);

  strokeWeight(2);
  line(-44, -8, -20, -8);
  line(60, -8, 84, -8);

  pop();
}



function painelMouse() {
  fill(15, 25, 38, 230);
  stroke(255);
  strokeWeight(2);
  rect(width / 2 - 250, 600, 500, 75, 18);

  noStroke();
  fill(255);
  textSize(18);
  text("Mire com o mouse", width / 2, 623);
  text("Clique para arremessar", width / 2, 647);

  let d = dist(lixo.x, lixo.y, mouseX, mouseY);
  d = constrain(d, 20, 260);
  let barra = map(d, 20, 260, 0, 380);

  fill("#222");
  rect(width / 2 - 190, 660, 380, 12, 8);

  fill("#FFD166");
  rect(width / 2 - 190, 660, barra, 12, 8);
}


function trajetoriaMouse() {
  if (lixo.jogado) return;

  let startX = lixo.x;
  let startY = lixo.y;

  let dx = mouseX - startX;
  let dy = mouseY - startY;

  let distancia = dist(startX, startY, mouseX, mouseY);
  distancia = constrain(distancia, 20, 260);

  let angulo = atan2(dy, dx);
  let forca = map(distancia, 20, 260, 4, 18);

  let vx = cos(angulo) * forca;
  let vy = sin(angulo) * forca;

  noFill();
  stroke(255);
  strokeWeight(4);
  drawingContext.setLineDash([12, 10]);

  beginShape();

  let simX = startX;
  let simY = startY;
  let simVX = vx;
  let simVY = vy;

  for (let i = 0; i < 55; i++) {
    simX += simVX;
    simY += simVY;

    simVX += vento;
    simVY += 0.36;

    vertex(simX, simY);
  }

  endShape();
  drawingContext.setLineDash([]);

  let setaX = startX + cos(angulo) * 65;
  let setaY = startY + sin(angulo) * 65;

  stroke("#FFD166");
  strokeWeight(5);
  line(startX, startY, setaX, setaY);

  push();
  translate(setaX, setaY);
  rotate(angulo);
  fill("#FFD166");
  noStroke();
  triangle(0, 0, -16, -8, -16, 8);
  pop();

  noFill();
  stroke("#FFD166");
  strokeWeight(2);
  ellipse(mouseX, mouseY, 22);
  line(mouseX - 14, mouseY, mouseX + 14, mouseY);
  line(mouseX, mouseY - 14, mouseX, mouseY + 14);
}

function arremessarMouse() {
  if (lixo.jogado || !(estado === "jogo" || estado === "boss")) return;

  let dx = mouseX - lixo.x;
  let dy = mouseY - lixo.y;

  let distancia = dist(lixo.x, lixo.y, mouseX, mouseY);
  distancia = constrain(distancia, 20, 260);

  let angulo = atan2(dy, dx);
  let forca = map(distancia, 20, 260, 4, 18);

  lixo.vx = cos(angulo) * forca;
  lixo.vy = sin(angulo) * forca;

  lixo.jogado = true;
}



function colisaoLixeiras() {
  if (!lixo.jogado) return;

  for (let b of bins) {
    let moveY = sin(frameCount * 0.025 + b.offset) * min(18, fase * 2);

    let acertouX = lixo.x > b.x - 48 && lixo.x < b.x + 48;
    let acertouY = lixo.y > b.y - 100 + moveY && lixo.y < b.y - 55 + moveY;

    if (acertouX && acertouY) {
      if (lixo.tipo.nome === b.tipo.nome) {
        combo++;
        comboTimer = 190;

        let ganho = 1 + combo;
        pontos += ganho;
        moedas += 2 + combo;

        explosao(lixo.x, lixo.y, b.tipo.cor, 45);
        textoFlutuante("+" + ganho + " COMBO!", lixo.x, lixo.y, b.tipo.cor);

        shake = 6;

        if (pontos % 10 === 0) fase++;

        embaralharLixeiras();
      } else {
        combo = 0;
        explosao(lixo.x, lixo.y, "#555555", 25);
        textoFlutuante("LIXEIRA ERRADA!", lixo.x, lixo.y, "#FFFFFF");
        shake = 3;
      }

      novoLixo();
    }
  }
}



function explosao(x, y, cor, qtd) {
  for (let i = 0; i < qtd; i++) {
    particulas.push({
      x,
      y,
      vx: random(-5, 5),
      vy: random(-5, 5),
      a: 255,
      tam: random(5, 12),
      cor
    });
  }
}

function atualizarParticulas() {
  for (let i = particulas.length - 1; i >= 0; i--) {
    let p = particulas[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.a -= 6;

    let c = color(p.cor);
    noStroke();
    fill(red(c), green(c), blue(c), p.a);
    ellipse(p.x, p.y, p.tam);

    if (p.a <= 0) particulas.splice(i, 1);
  }
}

function textoFlutuante(txt, x, y, cor) {
  textosFlutuantes.push({
    txt,
    x,
    y,
    a: 255,
    cor
  });
}

function atualizarTextos() {
  for (let i = textosFlutuantes.length - 1; i >= 0; i--) {
    let t = textosFlutuantes[i];

    t.y -= 1.2;
    t.a -= 4;

    let c = color(t.cor);
    fill(red(c), green(c), blue(c), t.a);
    noStroke();
    textSize(22);
    text(t.txt, t.x, t.y);

    if (t.a <= 0) textosFlutuantes.splice(i, 1);
  }
}


function finalizarJogo() {
  estado = "gameover";

  if (pontos > melhorPontuacao) {
    melhorPontuacao = pontos;
    localStorage.setItem("recicla_best", melhorPontuacao);
  }

  localStorage.setItem("recicla_moedas", moedas);
}

function telaGameOver() {
  painelEscuro();

  fill(255);
  textSize(64);
  text("FIM DE JOGO", width / 2, 170);

  textSize(28);
  text("Pontuação: " + pontos, width / 2, 260);
  text("Melhor: " + melhorPontuacao, width / 2, 305);
  text("Moedas: " + moedas, width / 2, 350);
  text("Fase alcançada: " + fase, width / 2, 395);

  botaoVisual(width / 2 - 160, 480, 320, 55, "R - REINICIAR");
  botaoVisual(width / 2 - 160, 550, 320, 55, "ESC - MENU");
}



function painelEscuro() {
  fill(0, 160);
  rect(0, 0, width, height);
}

function botaoVisual(x, y, w, h, txt) {
  fill(20, 25, 35, 230);
  stroke("#FFD166");
  strokeWeight(3);
  rect(x, y, w, h, 15);

  noStroke();
  fill(255);
  textSize(22);
  text(txt, x + w / 2, y + h / 2);
}


function keyPressed() {
  if (keyCode === ENTER && estado === "menu") {
    resetarJogo();
    estado = "jogo";
  }

  if ((key === "l" || key === "L") && estado === "menu") {
    estado = "loja";
  }

  if (keyCode === ESCAPE) {
    estado = "menu";
  }

  if ((key === "r" || key === "R") && estado === "gameover") {
    resetarJogo();
    estado = "jogo";
  }

  if (estado === "loja") {
    for (let i = 0; i < skins.length; i++) {
      if (key === String(i + 1)) {
        if (!skins[i].ok && moedas >= skins[i].preco) {
          moedas -= skins[i].preco;
          skins[i].ok = true;
          localStorage.setItem("recicla_moedas", moedas);
        }

        if (skins[i].ok) skinAtual = i;
      }
    }
  }
}

function mousePressed() {

  console.log(mouseX, mouseY);

  if (estado === "tutorial") {
    estado = "menu";
    return;
  }

  if (estado === "jogo" || estado === "boss") {
    arremessarMouse();
  }
}