document.addEventListener("DOMContentLoaded", () => {
    const ingresosInput = document.getElementById("ingresos");
    const gastosInputs = document.querySelectorAll(".input-gastos");
    let pieChartInstance = null;
    let barChartInstance = null;

    // Función para validar números
    function validateNumber(input) {
        let value = input.value.replace(/[^0-9]/g, ""); // Permitir solo números
        input.value = value; // Asignar el valor limpio al input
    }
    ingresosInput.addEventListener("input", () => validateNumber(ingresosInput));
    gastosInputs.forEach((input) => {
        input.addEventListener("input", () => validateNumber(input));
    });

    // Función para oscurecer un color
    function darkenColor(hexColor, factor = 0.7) {
        const r = Math.floor(parseInt(hexColor.slice(1, 3), 16) * factor);
        const g = Math.floor(parseInt(hexColor.slice(3, 5), 16) * factor);
        const b = Math.floor(parseInt(hexColor.slice(5, 7), 16) * factor);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    // Función para generar datos (solo para gráficos)
    function generateData() {
        const ingresosValue = Number(ingresosInput.value);
        if (!ingresosValue || ingresosValue <= 0) {
            alert("Por favor, ingresa un valor válido para los ingresos totales.");
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
        if (categorias.length === 0) {
            alert("No hay categorías con gastos mayores a cero para mostrar en la tabla o gráficos.");
            return null;
        }
        const totalGastos = categorias.reduce((sum, item) => sum + item.gasto, 0);
        categorias.forEach((item) => {
            item.porcentaje = ((item.gasto / ingresosValue) * 100).toFixed(2);
        });
        return { categorias, totalGastos };
    }

    // Función para crear la tabla
    function createTable(data) {
        const tablaDatos = document.querySelector("#tabla-datos tbody");
        tablaDatos.innerHTML = ""; // Limpiar tabla anterior
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

    // Función para crear el gráfico de pastel
    function createPieChart(data, colores) {
        console.log("Creando Gráfico de pastel");
        const pieChartCanvas = document.getElementById("pie-chart");
        pieChartInstance = new Chart(pieChartCanvas, {
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
                animation: {
                    duration: 2000,
                },
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
                            const total = dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${percentage}%`;
                        },
                        color: (context) => {
                            const backgroundColor = context.dataset.backgroundColor[context.dataIndex];
                            return darkenColor(backgroundColor);
                        },
                        anchor: (context) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = (context.dataset.data[context.dataIndex] / total) * 100;
                            return percentage < 10 ? "end" : "center";
                        },
                        align: (context) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = (context.dataset.data[context.dataIndex] / total) * 100;
                            return percentage < 10 ? "end" : "center";
                        },
                        offset: (context) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = (context.dataset.data[context.dataIndex] / total) * 100;
                            return percentage < 10 ? 10 : 0;
                        },
                        font: {
                            weight: "bold",
                            size: 14,
                        },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });
    }

    // Función para crear el gráfico de barras
    function createBarChart(data, colores) {
        console.log("Creando Gráfico de barras");
        const barChartCanvas = document.getElementById("bar-chart");
        barChartInstance = new Chart(barChartCanvas, {
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
                animation: {
                    duration: 2000,
                },
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
                },
            },
        });
    }

    // Observer para la tabla
    const tableObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const data = generateData();
                if (!data) return;

                createTable(data.categorias); // Crear la tabla
                tableObserver.unobserve(entry.target); // Detener la observación
            }
        });
    }, { rootMargin:"0px 0px -200px 0px", threshold: 1.0 });

    // Observer para el gráfico de pastel
    const pieChartObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const data = generateData();
                if (!data) return;

                const { categorias } = data;
                const colores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FF6F61"];

                createPieChart(categorias, colores);
                pieChartObserver.unobserve(entry.target); // Detener la observación
            }
        });
    }, { rootMargin:"0px 0px -185px 0px", threshold: 1.0 });

    // Observer para el gráfico de barras
    const barChartObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const data = generateData();
                if (!data) return;

                const { categorias } = data;
                const colores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FF6F61"];

                createBarChart(categorias, colores);
                barChartObserver.unobserve(entry.target); // Detener la observación
            }
        });
    }, { rootMargin:"0px 0px -80px 0px", threshold: 1.0 });

    // Observar el contenedor de la tabla
    const tablaContenedor = document.querySelector(".contenedor-tabla");
    if (tablaContenedor) tableObserver.observe(tablaContenedor);

    // Observar el contenedor del gráfico de pastel
    const pieChartContainer = document.querySelector(".contenedor-pastel");
    if (pieChartContainer) pieChartObserver.observe(pieChartContainer);

    // Observar el contenedor del gráfico de barras
    const barChartContainer = document.querySelector(".contenedor-barras");
    if (barChartContainer) barChartObserver.observe(barChartContainer);
});