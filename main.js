$('modal > .despesas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);
  
  const despesa = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria'),
    valor: dados.get('valor'),
    dataInicial: dados.get('data inicial'),
    dataFinal: dados.get('data final'),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  renderDespesa(despesa);
});

$('modal > .receitas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const receita = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria'),
    valor: dados.get('valor'),
    data: dados.get('data'),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  renderReceita(receita);
});

$('modal > .metas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const meta = {
    descricao: dados.get('descricao'),
    dataInicial: dados.get('data inicial'),
    dataFinal: dados.get('data final'),
  }

  renderMeta(meta);
});

function renderDespesa(despesa) {
  $('#lista-despesas').append(`
    <div class="item despesa">
      <p><strong>${despesa.descricao}</strong></p>
      <p>Categoria: ${despesa.categoria}</p>
      <p>Valor: R$ ${parseFloat(despesa.valor).toFixed(2)}</p>
      <p>De: ${despesa.dataInicial} até ${despesa.dataFinal}</p>
      <p>Recorrente: ${despesa.recorrente}</p>
      <p>Tipo: ${despesa.tipoValor}</p>
    </div>
  `);
}

function renderReceita(receita) {
  $('#lista-receitas').append(`
    <div class="item receita">
      <p><strong>${receita.descricao}</strong></p>
      <p>Categoria: ${receita.categoria}</p>
      <p>Valor: R$ ${parseFloat(receita.valor).toFixed(2)}</p>
      <p>Data: ${receita.data}</p>
      <p>Recorrente: ${receita.recorrente}</p>
      <p>Tipo: ${receita.tipoValor}</p>
    </div>
  `);
}

function renderMeta(meta) {
  $('#lista-metas').append(`
    <div class="item meta">
      <p><strong>${meta.descricao}</strong></p>
      <p>De: ${meta.dataInicial} até ${meta.dataFinal}</p>
    </div>
  `);
}