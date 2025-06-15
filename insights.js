function gerarGraficoDespesasPorCategoria() {
  // Agrupar e somar despesas por categoria
  const categoriasTotais = {};

  itens.filter(i => i.tipo === 'despesas').forEach(d => {
    if (!categoriasTotais[d.categoria]) {
      categoriasTotais[d.categoria] = 0;
    }
    categoriasTotais[d.categoria] += d.valor;
  });

  // Extrair labels (categorias) e data (totais)
  const labels = Object.keys(categoriasTotais);
  const data = Object.values(categoriasTotais);

  // Cores aleatórias para cada categoria
  const backgroundColor = labels.map(() =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  );

  // Destruir gráfico anterior se já existir
  if (window.meuGrafico) {
    window.meuGrafico.destroy();
  }

  const ctx = document.getElementById('gastos-categoria').getContext('2d');

  window.meuGrafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gasto Total',
        data: data,
        backgroundColor: backgroundColor,
        borderColor: 'transparent'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'DESPESAS',
          font: {size: 32}
        },
        legend: {
          position: 'right'
        }
      }
    }
  });
}