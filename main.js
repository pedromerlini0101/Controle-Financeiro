const despesas = [];
const receitas = [];
const metas = [];

$('modal > .despesas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const despesa = {
    id: Date.now(),
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado' ? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }
  
  despesas.push(despesa);
  atualizarTotais();
  renderDespesa(despesa);
  this.reset();
});

$('modal > .receitas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const receita = {
    id: Date.now(),
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado' ? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  receitas.push(receita);
  atualizarTotais();
  renderReceita(receita);
  this.reset();
});

$('modal > .metas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const meta = {
    id: Date.now(),
    descricao: dados.get('descricao'),
  }

  metas.push(meta);
  renderMeta(meta);
  this.reset();
});

function atualizarTotais() {
  $('#despesa p').text('R$' + despesasTotal());
  $('#receita p').text('R$' + receitasTotal());
  $('#saldo p').text('R$' + saldoTotal());
  $('#saldo p').css('color', saldoTotal() < 0 ? 'tomato' : '#6b7280');
}

function renderDespesa(despesa) {
  const recorrenteBadge = despesa.recorrente.toLowerCase() === 'sim'
    ? `<span class="badge badge-recorrente">Recorrente</span>`
    : '';
  const tipoBadge = `<span class="badge badge-tipo">${despesa.tipoValor}</span>`;

  $('#lista-despesas').append(`
    <div id="${despesa.id}" class="item despesa" draggable="true" style="position: relative">
      <p><strong>${despesa.descricao}</strong></p>
      <p>Categoria: ${despesa.categoria}</p>
      <p>Valor: R$ ${parseFloat(despesa.valor).toFixed(2)}</p>
      ${recorrenteBadge}
      ${tipoBadge}
      <i class="fa-solid fa-pen-to-square editar-despesa"
         data-id="${despesa.id}"
         style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
    </div>
  `);
  
  gerarGraficoDespesasPorCategoria();
}

function renderReceita(receita) {
  const recorrenteBadge = receita.recorrente.toLowerCase() === 'sim'
    ? `<span class="badge badge-recorrente">Recorrente</span>`
    : '';
  const tipoBadge = `<span class="badge badge-tipo">${receita.tipoValor}</span>`;

  $('#lista-receitas').append(`
    <div id="${receita.id}" class="item receita" draggable="true" style="position: relative">
      <p><strong>${receita.descricao}</strong></p>
      <p>Categoria: ${receita.categoria}</p>
      <p>Valor: R$ ${parseFloat(receita.valor).toFixed(2)}</p>
      ${recorrenteBadge}
      ${tipoBadge}
      <i class="fa-solid fa-pen-to-square editar-receita"
         data-id="${receita.id}"
         style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
    </div>
  `);
}

function renderMeta(meta) {
  $('#lista-metas').append(`
    <div id="${meta.id}" class="item meta" draggable="true" style="position: relative">
      <p><strong>${meta.descricao}</strong></p>
      <i class="fa-solid fa-pen-to-square editar-meta"
         data-id="${meta.id}"
         style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px"></i>
    </div>
  `);
}

function despesasTotal() {
  return despesas.reduce((total, d) => total + d.valor, 0).toFixed(2);
}

function receitasTotal() {
  return receitas.reduce((total, r) => total + r.valor, 0).toFixed(2);
}

function saldoTotal() {
  return (receitasTotal() - despesasTotal()).toFixed(2);
}

// 🛠️ Editar DESPESA
$(document).on('click', '.editar-despesa', function () {
  const id = $(this).data('id');
  const item = despesas.find(d => d.id == id);
  if (!item) return;

  const novaDescricao = prompt('Descrição:', item.descricao) || item.descricao;
  const novaCategoria = prompt('Categoria:', item.categoria) || item.categoria;
  const novoValor = parseFloat(prompt('Valor:', item.valor)) || item.valor;
  const novoRecorrente = prompt('Recorrente? (Sim/Não):', item.recorrente) || item.recorrente;
  const novoTipo = prompt('Tipo de valor:', item.tipoValor) || item.tipoValor;

  item.descricao = novaDescricao;
  item.categoria = novaCategoria;
  item.valor = novoValor;
  item.recorrente = novoRecorrente;
  item.tipoValor = novoTipo;

  $(`#${id}`).remove();
  renderDespesa(item);
  atualizarTotais();
});

// 🛠️ Editar RECEITA
$(document).on('click', '.editar-receita', function () {
  const id = $(this).data('id');
  const item = receitas.find(r => r.id == id);
  if (!item) return;

  const novaDescricao = prompt('Descrição:', item.descricao) || item.descricao;
  const novaCategoria = prompt('Categoria:', item.categoria) || item.categoria;
  const novoValor = parseFloat(prompt('Valor:', item.valor)) || item.valor;
  const novoRecorrente = prompt('Recorrente? (Sim/Não):', item.recorrente) || item.recorrente;
  const novoTipo = prompt('Tipo de valor:', item.tipoValor) || item.tipoValor;

  item.descricao = novaDescricao;
  item.categoria = novaCategoria;
  item.valor = novoValor;
  item.recorrente = novoRecorrente;
  item.tipoValor = novoTipo;

  $(`#${id}`).remove();
  renderReceita(item);
  atualizarTotais();
});

// 🛠️ Editar META
$(document).on('click', '.editar-meta', function () {
  const id = $(this).data('id');
  const item = metas.find(m => m.id == id);
  if (!item) return;

  const novaDescricao = prompt('Descrição da meta:', item.descricao) || item.descricao;
  item.descricao = novaDescricao;

  $(`#${id}`).remove();
  renderMeta(item);
});

// Mostrar a lixeira quando iniciar o drag
$(document).on('dragstart', '.item', function (e) {
  $('#lixeira').show();
  e.originalEvent.dataTransfer.setData('text/plain', $(this).attr('id'));
});

// Esconder a lixeira quando terminar o drag
$(document).on('dragend', '.item', function () {
  $('#lixeira').hide();
});

// Permitir soltar na lixeira
$('#lixeira').on('dragover', function (e) {
  e.preventDefault();
  $(this).css('background', '#dc2626'); // vermelho mais escuro
});

$('#lixeira').on('dragleave', function () {
  $(this).css('background', '#f87171'); // volta ao normal
});

// Soltar para deletar
$('#lixeira').on('drop', function (e) {
  e.preventDefault();
  const id = e.originalEvent.dataTransfer.getData('text/plain');
  const $item = $('#' + id);

  if (!$item.length) return;

  if ($item.hasClass('despesa')) {
    const index = despesas.findIndex(d => d.id == id);
    if (index !== -1) despesas.splice(index, 1);
    gerarGraficoDespesasPorCategoria();
  } else if ($item.hasClass('receita')) {
    const index = receitas.findIndex(r => r.id == id);
    if (index !== -1) receitas.splice(index, 1);
  } else if ($item.hasClass('meta')) {
    const index = metas.findIndex(m => m.id == id);
    if (index !== -1) metas.splice(index, 1);
  }

  $item.remove();
  atualizarTotais();
  $(this).css('background', '#f87171'); // reseta cor
    $('#lixeira').hide();
});

// Mudar de Seção
$('.main-page-btn').on('click', () => {
  $('[id="main-page"]').show()
  $('[id="insights-page"]').hide()
  $('[id="relatorio-page"]').hide()
})

$('.insights-page-btn').on('click', () => {
  $('[id="insights-page"]').show()
  $('[id="main-page"').hide()
  $('[id="relatorio-page"]').hide()
})

$('.relatorio-page-btn').on('click', () => {
  $('[id="relatorio-page"]').show()
  $('[id="insights-page"]').hide()
  $('[id="main-page"').hide()
})