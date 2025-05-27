$('modal > .despesas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);
  
  const despesa = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado'? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: dados.get('valor'),
    dataInicial: new Date(dados.get('data inicial')).toLocaleDateString(),
    dataFinal: new Date(dados.get('data final')).toLocaleDateString(),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  renderDespesa(despesa);
  this.reset(); // limpa o formulário
  
  // Repor as datas com a data atual
  const hoje = new Date().toISOString().split('T')[0];
  $(this).find('input[type="date"]').val(hoje);
});

$('modal > .receitas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const receita = {
    descricao: dados.get('descricao'),
    categoria: dados.get('categoria') !== 'Personalizado'? dados.get('categoria') : dados.get('categoria-personalizado'),
    valor: dados.get('valor'),
    data: new Date(dados.get('data')).toLocaleDateString(),
    recorrente: dados.get('recorrente'),
    tipoValor: dados.get('tipo valor')
  }

  renderReceita(receita);
  this.reset();
  
  // Repor as datas com a data atual
  const hoje = new Date().toISOString().split('T')[0];
  $(this).find('input[type="date"]').val(hoje);
});

$('modal > .metas').on('submit', function(e) {
  e.preventDefault();
  const dados = new FormData(this);

  const meta = {
    descricao: dados.get('descricao'),
    dataInicial: new Date(dados.get('data inicial')).toLocaleDateString(),
    dataFinal: new Date(dados.get('data final')).toLocaleDateString(),
  }

  renderMeta(meta);
  this.reset();
  
  // Repor as datas com a data atual
  const hoje = new Date().toISOString().split('T')[0];
  $(this).find('input[type="date"]').val(hoje);
});

function renderDespesa(despesa) {
  $('#lista-despesas').append(`
    <div class="item despesa" style="position: relative">
      <p><strong>${despesa.descricao}</strong></p>
      <p>Categoria: ${despesa.categoria}</p>
      <p>Valor: R$ ${parseFloat(despesa.valor).toFixed(2)}</p>
      <p>De: ${despesa.dataInicial} até ${despesa.dataFinal}</p>
      <p>Recorrente: ${despesa.recorrente}</p>
      <p>Tipo: ${despesa.tipoValor}</p>
      <i style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px" class="fa-solid fa-pen-to-square"></i>
    </div>
  `);
}

function renderReceita(receita) {
  $('#lista-receitas').append(`
    <div class="item receita" style="position: relative">
      <p><strong>${receita.descricao}</strong></p>
      <p>Categoria: ${receita.categoria}</p>
      <p>Valor: R$ ${parseFloat(receita.valor).toFixed(2)}</p>
      <p>Data: ${receita.data}</p>
      <p>Recorrente: ${receita.recorrente}</p>
      <p>Tipo: ${receita.tipoValor}</p>
      <i style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px" class="fa-solid fa-pen-to-square"></i>
    </div>
  `);
}

function renderMeta(meta) {
  $('#lista-metas').append(`
    <div class="item meta" style="position: relative">
      <p><strong>${meta.descricao}</strong></p>
      <p>De: ${meta.dataInicial} até ${meta.dataFinal}</p>
      <i style="font-size: 1.2rem; color: gray; cursor: pointer; position: absolute; top: 15px; right: 15px" class="fa-solid fa-pen-to-square"></i>
    </div>
  `);
}
