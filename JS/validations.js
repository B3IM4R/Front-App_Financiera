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
            alert("Por favor, completa el campo de ingresos totales antes de ingresar gastos.");
            gastosInputs.forEach((input) => input.value = "");
            updateGastosAcumulados();
            return;
        }

        const totalGastos = Array.from(gastosInputs).reduce((sum, input) => {
            const gasto = Number(input.value.replace(/\./g, ""));
            return sum + gasto;
        }, 0);

        if (totalGastos > ingresosValue) {
            alert("El total de gastos no puede superar los ingresos.");

            for (let i = gastosInputs.length - 1; i >= 0; i--) {
                const input = gastosInputs[i];
                const gasto = Number(input.value.replace(/\./g, ""));

                if (gasto > 0) {
                    input.value = "";
                    break;
                }
            }
        }

        updateGastosAcumulados();
    }

    ingresosInput.addEventListener("input", validateGastosVsIngresos);
    gastosInputs.forEach((input) => {
        input.addEventListener("input", validateGastosVsIngresos);
    });
});