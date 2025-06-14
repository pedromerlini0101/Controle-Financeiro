const despesas = [];
const receitas = [];
const metas = [];

// ➕ Despesa
$('modal > .despesas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const despesa = {
    id: Date.now(),
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado' ? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor'),
    data: dados.get('data') || ''
  };
  
  despesas.push(despesa);
  atualizarTotais();
  renderDespesa(despesa);
  this.reset();
});

// ➕ Receita
$('modal > .receitas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const receita = {
    id: Date.now(),
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado' ? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor'),
    data: dados.get('data') || ''
  };

  receitas.push(receita);
  atualizarTotais();
  renderReceita(receita);
  this.reset();
});

// ➕ Meta
$('modal > .metas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);
  
  const meta = {
    id: Date.now(),
    descricao: dados.get('descricao'),
    dataInicio: dados.get('data-inicio'),
    dataFim: dados.get('data-fim')
  };

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
      <p>Data: ${despesa.data || '–'}</p>
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
      <p>Data: ${receita.data || '–'}</p>
      ${recorrenteBadge}
      ${tipoBadge}
      <i class="fa-solid fa-pen-to-square editar-receita"
         data-id="${receita.id}"
         style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
    </div>
  `);
}

function renderMeta(meta) {
  let dataText = ''
  if(meta.dataInicio && !meta.dataFim){
    dataText = `de ${meta.dataInicio}`
  } else if(!meta.dataInicio && meta.dataFim){
    dataText = `até ${meta.dataFim}`
  } else if(meta.dataInicio && meta.dataFim) {
    dataText = `de ${meta.dataInicio} até ${meta.dataFim}`
  }

  $('#lista-metas').append(`
    <div id="${meta.id}" class="item meta" draggable="true" style="position: relative">
      <p><strong>${meta.descricao}</strong></p>
      <p>${dataText}</p>
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

// 🗑️ Drag & Drop para deletar
$(document).on('dragstart', '.item', function (e) {
  $('#lixeira').show();
  e.originalEvent.dataTransfer.setData('text/plain', $(this).attr('id'));
});
$(document).on('dragend', '.item', function () {
  $('#lixeira').hide();
});
$('#lixeira').on('dragover', function (e) {
  e.preventDefault();
  $(this).css('background', '#dc2626');
});
$('#lixeira').on('dragleave', function () {
  $(this).css('background', '#f87171');
});
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
  $(this).css('background', '#f87171');
  $('#lixeira').hide();
});

// Navegação
$('.main-page-btn').on('click', () => {
  $('[id="main-page"]').show();
  $('[id="insights-page"]').hide();
  $('[id="relatorio-page"]').hide();
});
$('.insights-page-btn').on('click', () => {
  $('[id="insights-page"]').show();
  $('[id="main-page"]').hide();
  $('[id="relatorio-page"]').hide();
});
$('.relatorio-page-btn').on('click', () => {
  $('[id="relatorio-page"]').show();
  $('[id="insights-page"]').hide();
  $('[id="main-page"]').hide();
});

function abrirModalEdicao(tipo, item) {
  const $modal = $('#modal-editar');
  const $form = $('#form-editar')[0];

  $form.tipo.value = tipo;
  $form.id.value = item.id;
  $form.descricao.value = item.descricao || '';

  $form.categoria && ($form.categoria.value = item.categoria || '');
  $form.valor && ($form.valor.value = item.valor || '');
  $form.recorrente && ($form.recorrente.value = item.recorrente || 'Não');
  $form.tipoValor && ($form.tipoValor.value = item.tipoValor || '');
  $form.data && ($form.data.value = item.data || '');

  $form.dataInicio && ($form.dataInicio.value = item.dataInicio || '');
  $form.dataFim && ($form.dataFim.value = item.dataFim || '');

  // Oculta todos os campos
  $('.grupo-editar-categoria, .grupo-editar-valor, .grupo-editar-recorrente, .grupo-editar-tipo, .grupo-editar-data').hide();
  $('.grupo-editar-data-inicio, .grupo-editar-data-fim').hide();

  // Mostra apenas os necessários
  if (tipo === 'despesa' || tipo === 'receita') {
    $('.grupo-editar-categoria, .grupo-editar-valor, .grupo-editar-recorrente, .grupo-editar-tipo, .grupo-editar-data').show();
  } else if (tipo === 'meta') {
    $('.grupo-editar-data-inicio, .grupo-editar-data-fim').show();
  }

  $modal.show();
}

// Submeter a edição
$('#form-editar').on('submit', function (e) {
  e.preventDefault();
  const dados = new FormData(this);
  const tipo = dados.get('tipo');
  const id = +dados.get('id');

  const atualizar = (lista, renderFn) => {
    const item = lista.find(i => i.id === id);
    if (!item) return;

    item.descricao = dados.get('descricao');
    if (item.hasOwnProperty('categoria')) item.categoria = dados.get('categoria');
    if (item.hasOwnProperty('valor')) item.valor = parseFloat(dados.get('valor'));
    if (item.hasOwnProperty('recorrente')) item.recorrente = dados.get('recorrente');
    if (item.hasOwnProperty('tipoValor')) item.tipoValor = dados.get('tipoValor');
    if (item.hasOwnProperty('data')) item.data = dados.get('data');
    if (item.hasOwnProperty('dataInicio')) item.dataInicio = dados.get('dataInicio');
    if (item.hasOwnProperty('dataFim')) item.dataFim = dados.get('dataFim');

    $(`#${id}`).remove();
    renderFn(item);
    atualizarTotais();
    $('#modal-editar').hide();
  };

  if (tipo === 'despesa') atualizar(despesas, renderDespesa);
  else if (tipo === 'receita') atualizar(receitas, renderReceita);
  else if (tipo === 'meta') atualizar(metas, renderMeta);
});

// Botão de cancelar edição
$('#cancelar-edicao').on('click', () => {
  $('#modal-editar').hide();
});

// Eventos de clique nos botões de edição
$(document).on('click', '.editar-despesa', function () {
  const id = $(this).data('id');
  const item = despesas.find(d => d.id == id);
  if (item) abrirModalEdicao('despesa', item);
});

$(document).on('click', '.editar-receita', function () {
  const id = $(this).data('id');
  const item = receitas.find(r => r.id == id);
  if (item) abrirModalEdicao('receita', item);
});

$(document).on('click', '.editar-meta', function () {
  const id = $(this).data('id');
  const item = metas.find(m => m.id == id);
  if (item) abrirModalEdicao('meta', item);
});