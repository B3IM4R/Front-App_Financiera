document.addEventListener("DOMContentLoaded", () => {
    const ingresosInput = document.getElementById("ingresos");
    const gastosInputs = document.querySelectorAll(".input-gastos");
    let pieChartInstance = null;
    let barChartInstance = null;

    const colores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FF6F61"];
    const mensajeAdvertencia = document.getElementById("mensaje-advertencia");

    function darkenColor(hexColor, factor = 0.7) {
        const r = Math.floor(parseInt(hexColor.slice(1, 3), 16) * factor);
        const g = Math.floor(parseInt(hexColor.slice(3, 5), 16) * factor);
        const b = Math.floor(parseInt(hexColor.slice(5, 7), 16) * factor);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    function generateData() {
        const ingresosValue = Number(ingresosInput.value);
        if (!ingresosValue || ingresosValue <= 0) {
            mensajeAdvertencia.textContent =
                "Por favor, completa el campo de ingresos totales.";
            mensajeAdvertencia.style.display = "block";
            return null;
        }

        const categorias = [];
        gastosInputs.forEach((input) => {
            const categoria = input.closest(".categoria").querySelector(".nombre-categoria").textContent.trim();
            const gasto = Number(input.value) || 0;
            if (gasto > 0) {
                categorias.push({ nombre: categoria, gasto });
            }
        });

        if (categorias.length < 4) {
            mensajeAdvertencia.textContent =
                "Debes llenar al menos 4 categorías con gastos mayores a cero.";
            mensajeAdvertencia.style.display = "block";
            return null;
        }

        const totalGastos = categorias.reduce((sum, item) => sum + item.gasto, 0);

        if (totalGastos !== ingresosValue) {
            mensajeAdvertencia.textContent =
                "Los gastos no cubren el 100% de los ingresos.";
            mensajeAdvertencia.style.display = "block";
        } else {
            mensajeAdvertencia.style.display = "none";
        }

        categorias.forEach((item) => {
            item.porcentaje = Math.floor((item.gasto / ingresosValue) * 100);
        });

        return { categorias, totalGastos };
    }

    function createTable(data) {
        const tablaDatos = document.querySelector("#tabla-datos tbody");
        tablaDatos.innerHTML = "";

        data.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.gasto.toLocaleString("es-CO")}</td>
                <td>${item.porcentaje}%</td>
            `;
            tablaDatos.appendChild(row);
        });
    }

    function createPieChart(data, colores) {
        console.log("Creando Gráfico de pastel");
        const pieChartCanvas = document.getElementById("pie-chart");

        if (pieChartCanvas.chartInstance) {
            pieChartCanvas.chartInstance.destroy();
        }

        pieChartCanvas.chartInstance = new Chart(pieChartCanvas, {
            type: "pie",
            data: {
                labels: data.map((item) => item.nombre),
                datasets: [
                    {
                        data: data.map((item) => item.gasto),
                        backgroundColor: colores.slice(0, data.length),
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 2000 },
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || "";
                                const value = context.raw || 0;
                                return `${label}: $${value.toLocaleString("es-CO")}`;
                            },
                        },
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            const dataset = context.chart.data.datasets[0];
                            const ingresosValue = Number(ingresosInput.value);
                            const percentage = Math.floor((value / ingresosValue) * 100);
                            return `${percentage}%`;
                        },
                        color: (context) => darkenColor(context.dataset.backgroundColor[context.dataIndex]),
                        font: { weight: "bold", size: 14 },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });
    }

    function createBarChart(data, colores) {
        console.log("Creando Gráfico de barras");
        const barChartCanvas = document.getElementById("bar-chart");

        if (barChartCanvas.chartInstance) {
            barChartCanvas.chartInstance.destroy();
        }

        barChartCanvas.chartInstance = new Chart(barChartCanvas, {
            type: "bar",
            data: {
                labels: data.map((item) => item.nombre),
                datasets: [
                    {
                        label: "Total Gastado",
                        data: data.map((item) => item.gasto),
                        backgroundColor: colores.slice(0, data.length),
                        borderColor: colores.slice(0, data.length),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 2000 },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `$${value.toLocaleString("es-CO")}`,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || "";
                                const value = context.raw || 0;
                                return `${label}: $${value.toLocaleString("es-CO")}`;
                            },
                        },
                    },
                    datalabels: {
                        display: false,
                    },
                },
            },
            plugins: [ChartDataLabels],
        });
    }

    function setupObservers() {
        const observers = [
            { target: ".contenedor-tabla", callback: (data) => createTable(data.categorias) },
            { target: ".contenedor-pastel", callback: (data) => createPieChart(data.categorias, colores) },
            { target: ".contenedor-barras", callback: (data) => createBarChart(data.categorias, colores) },
        ];

        observers.forEach(({ target, callback }) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const data = generateData();
                        if (!data) return;

                        callback(data);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -100px 0px", threshold: 1.0 });

            const container = document.querySelector(target);
            if (container) observer.observe(container);
        });
    }

    function setupInputListeners() {
        ingresosInput.addEventListener("input", () => {
            setupObservers();
        });

        gastosInputs.forEach((input) => {
            input.addEventListener("input", () => {
                setupObservers();
            });
        });
    }

    setupObservers();
    setupInputListeners();
});