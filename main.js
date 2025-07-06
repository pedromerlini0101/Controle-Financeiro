const itens = [];

// ➕ Item
$('modal form').on('submit', function (e) {
  e.preventDefault();
  const dados = new FormData(this);
  const editandoId = dados.get('editando-id');

  const item = {
    id: editandoId ? Number(editandoId) : Date.now(),
    tipo: dados.get('tipo'),
    descricao: dados.get('descricao'),
    categoria: (dados.get('categoria') !== 'Personalizado' ? dados.get('categoria') : dados.get('categoria-personalizado')) || '',
    valor: parseFloat(dados.get('valor')) || 0,
    recorrente: dados.get('recorrente') || '',
    tipoValor: dados.get('tipo_valor') || '',
    data: dados.get('data') || '',
    dataInicio: dados.get('dataInicio') || '',
    dataFim: dados.get('dataFim') || ''
  };

  if (editandoId) {
    const index = itens.findIndex(i => i.id === Number(editandoId));
    if (index !== -1) {
      itens[index] = item;
      $(`#${item.id}`).remove(); // remove antigo
      renderItem(item, item.tipo); // re-renderiza
    }
  } else {
    itens.push(item);
    renderItem(item, item.tipo);
  }

  gerarTodosGraficos()
  atualizarTotais();
  $(this).find('[name="editando-id"]').remove()
  this.reset();
});

function atualizarTotais() {
  $('#despesa p').text('R$' + despesasTotal());
  $('#receita p').text('R$' + receitasTotal());
  $('#saldo p').text('R$' + saldoTotal());
  $('#saldo p').css('color', saldoTotal() < 0 ? 'tomato' : '#6b7280');
}

function renderItem(item, tipo) {
  if(tipo === 'despesas' || tipo === 'receitas'){
    const recorrenteBadge = item.recorrente.toLowerCase() === 'sim'
    ? `<span class="badge badge-recorrente">recorrente</span>`
    : '';
    const tipoBadge = `<span class="badge badge-tipo">${item.tipoValor}</span>`;

    $(`#lista-${tipo}`).append(`
      <div id="${item.id}" class="item ${item.tipo}" draggable="true" style="position: relative">
        <p><strong>${item.descricao}</strong></p>
        <p>Categoria: ${item.categoria}</p>
        <p>Valor: R$ ${parseFloat(item.valor).toFixed(2)}</p>
        <p>Data: ${item.data || '–'}</p>
        ${recorrenteBadge}
        ${tipoBadge}
        <i class="fa-solid fa-pen-to-square"
          data-id="${item.id}"
          style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
      </div>
    `);
  }else{
    let dataText = ''
    if(item.dataInicio && !item.dataFim){
      dataText = `de ${item.dataInicio}`
    } else if(!item.dataInicio && item.dataFim){
      dataText = `até ${item.dataFim}`
    } else if(item.dataInicio && item.dataFim) {
      dataText = `de ${item.dataInicio} até ${item.dataFim}`
    }

    $('#lista-metas').append(`
      <div id="${item.id}" class="item metas" draggable="true" style="position: relative">
        <p><strong>${item.descricao}</strong></p>
        <p>${dataText}</p>
        <i class="fa-solid fa-pen-to-square"
          data-id="${item.id}"
         style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px"></i>
      </div>
    `);
  }
}

function despesasTotal() {
  return itens
    .filter(item => item.tipo === 'despesas')
    .reduce((total, d) => total + Number(d.valor), 0)
    .toFixed(2);
}

function receitasTotal() {
  return itens
    .filter(item => item.tipo === 'receitas')
    .reduce((total, r) => total + Number(r.valor), 0)
    .toFixed(2);
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
  
  const index = itens.findIndex(i => i.id == id);
  if(index !== -1) itens.splice(index, 1);

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

// Abrir modal ao editar
$(document).on('click', '.fa-pen-to-square', function () {
  const id = $(this).data('id');
  const item = itens.find(i => i.id === id);
  if (!item) return;

  const el = document.querySelector('#main-page main');
  Alpine.$data(el).modalOpen = true;

  const form = $('#container');
  form.find('[name="editando-id"]').remove(); // evita duplicatas
  form.prepend(`<input type="hidden" name="editando-id" value="${item.id}">`);

  form.find('[name="tipo"]').val(item.tipo);
  form.find('[name="descricao"]').val(item.descricao);
  form.find('[name="categoria"]').val(item.categoria);
  form.find('[name="categoria-personalizado"]').val(item.categoria || '');
  form.find('[name="valor"]').val(item.valor || '');
  form.find('[name="data"]').val(item.data || '');
  form.find('[name="dataInicio"]').val(item.dataInicio || '');
  form.find('[name="dataFim"]').val(item.dataFim || '');
  form.find('[name="recorrente"]').val(item.recorrente || '');
  form.find('[name="tipo_valor"]').val(item.tipoValor || '');
});