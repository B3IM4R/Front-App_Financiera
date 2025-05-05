document.addEventListener("DOMContentLoaded", () => {
    const ingresosInput = document.getElementById("ingresos");
    const gastosInputs = document.querySelectorAll(".input-gastos");
    const gastosAcumuladosElement = document.getElementById("gastos-acumulados");

    function formatNumber(value) {
        return value.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function validateNumber(input) {
        let rawValue = input.value.replace(/\D/g, "");
        rawValue = rawValue.replace(/^0+/, "");
        input.value = formatNumber(rawValue);
    }

    ingresosInput.addEventListener("input", () => validateNumber(ingresosInput));

    gastosInputs.forEach((input) => {
        input.addEventListener("input", () => validateNumber(input));
    });

    function updateGastosAcumulados() {
        const totalGastos = Array.from(gastosInputs).reduce((sum, input) => {
            const gasto = Number(input.value.replace(/\./g, ""));
            return sum + gasto;
        }, 0);

        gastosAcumuladosElement.textContent = formatNumber(totalGastos.toString());
    }

    function validateGastosVsIngresos() {
        const ingresosValue = Number(ingresosInput.value.replace(/\./g, ""));
        if (!ingresosValue || ingresosValue <= 0) {
            alert("Debes ingresar un valor válido y mayor a cero en el campo de ingresos para poder registrar los gastos.");
            gastosInputs.forEach((input) => input.value = "");
            updateGastosAcumulados();
            return;
        }

        let totalGastos = 0;
        let eliminadosIndividuales = [];

        gastosInputs.forEach((input, i) => {
            const gasto = Number(input.value.replace(/\./g, ""));
            if (gasto > ingresosValue) {
                eliminadosIndividuales.push(input.dataset.label || `Campo ${i + 1}`);
                input.value = "";
            }
        });

        totalGastos = Array.from(gastosInputs).reduce((sum, input) => {
            return sum + Number(input.value.replace(/\./g, ""));
        }, 0);

        let eliminadosPorSuma = [];

        if (totalGastos > ingresosValue) {
            for (let i = gastosInputs.length - 1; i >= 0 && totalGastos > ingresosValue; i--) {
                const input = gastosInputs[i];
                const gasto = Number(input.value.replace(/\./g, ""));
                if (gasto > 0) {
                    eliminadosPorSuma.push(input.dataset.label || `Campo ${i + 1}`);
                    input.value = "";
                    totalGastos -= gasto;
                }
            }
        }

        if (eliminadosIndividuales.length > 0) {
            alert(`Se eliminarán los valores de los siguientes campos porque superan individualmente los ingresos:\n\n- ${eliminadosIndividuales.join('\n- ')}`);
        }

        if (eliminadosPorSuma.length > 0) {
            alert(`Se eliminarán los valores de los siguientes campos para que la suma total de gastos no supere los ingresos:\n\n- ${eliminadosPorSuma.join('\n- ')}`);
        }

        updateGastosAcumulados();
    }

    ingresosInput.addEventListener("input", validateGastosVsIngresos);
    gastosInputs.forEach((input) => {
        input.addEventListener("input", validateGastosVsIngresos);
    });
});