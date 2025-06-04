const despesas = []
const receitas = []
const metas = []

$('modal > .despesas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);
  
  const despesa = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado'? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }
  
  despesas.push(despesa)
  $('#despesa p').text('R$' + despesasTotal())
  $('#saldo p').text('R$' + saldoTotal())
  $('#saldo p').css('color', saldoTotal() < 0? 'tomato':'#6b7280')
  renderDespesa(despesa);
  this.reset(); // limpa o formulário
});

$('modal > .receitas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const receita = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado'? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: parseFloat(dados.get('valor')),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  receitas.push(receita)
  $('#receita p').text('R$' + receitasTotal())
  $('#saldo p').text('R$' + saldoTotal())
    $('#saldo p').css('color', saldoTotal() < 0? 'tomato':'#6b7280')
  renderReceita(receita);
  this.reset();
});

$('modal > .metas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const meta = {
    descricao: dados.get('descricao'),
  }

  metas.push(meta)
  renderMeta(meta);
  this.reset();
});

function renderDespesa(despesa) {
  const recorrenteBadge = despesa.recorrente.toLowerCase() === 'sim' 
    ? `<span class="badge badge-recorrente">Recorrente</span>` 
    : '';

  const tipoBadge = `<span class="badge badge-tipo">${despesa.tipoValor}</span>`;

  $('#lista-despesas').append(`
    <div class="item despesa" style="position: relative">
      <p><strong>${despesa.descricao}</strong></p>
      <p>Categoria: ${despesa.categoria}</p>
      <p>Valor: R$ ${parseFloat(despesa.valor).toFixed(2)}</p>
      ${recorrenteBadge}
      ${tipoBadge}
      <i class="fa-solid fa-pen-to-square" 
         style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
    </div>
  `);
}

function renderReceita(receita) {
  const recorrenteBadge = receita.recorrente.toLowerCase() === 'sim' 
    ? `<span class="badge badge-recorrente">Recorrente</span>` 
    : '';

  const tipoBadge = `<span class="badge badge-tipo">${receita.tipoValor}</span>`;

  $('#lista-receitas').append(`
    <div class="item receita" style="position: relative">
      <p><strong>${receita.descricao}</strong></p>
      <p>Categoria: ${receita.categoria}</p>
      <p>Valor: R$ ${parseFloat(receita.valor).toFixed(2)}</p>
      ${recorrenteBadge}
      ${tipoBadge}
      <i class="fa-solid fa-pen-to-square" 
         style="font-size:1.2rem; color:gray; cursor:pointer; position:absolute; top:15px; right:15px"></i>
    </div>
  `);
}

function renderMeta(meta) {
  $('#lista-metas').append(`
    <div class="item meta" style="position: relative">
      <p><strong>${meta.descricao}</strong></p>
      <i style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px" class="fa-solid fa-pen-to-square"></i>
    </div>
  `);
}

function despesasTotal() {
  let i = 0
  for(let d of despesas) i += d.valor
  return parseFloat(i).toFixed(2)
}

function receitasTotal() {
  let i = 0
  for(let r of receitas) i += r.valor
  return parseFloat(i).toFixed(2)
}

function saldoTotal() {
  return receitasTotal() - despesasTotal()
}