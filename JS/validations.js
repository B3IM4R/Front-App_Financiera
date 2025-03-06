document.addEventListener("DOMContentLoaded", () => {
    const ingresosInput = document.getElementById("ingresos");
    const gastosInputs = document.querySelectorAll(".input-gastos");

    function validateNumber(input) {
        let value = input.value.replace(/[^0-9]/g, "");
        input.value = value;
    }

    ingresosInput.addEventListener("input", () => validateNumber(ingresosInput));

    gastosInputs.forEach((input) => {
        input.addEventListener("input", () => validateNumber(input));
    });

    function validateGastosVsIngresos() {
        const ingresosValue = Number(ingresosInput.value);
        if (!ingresosValue || ingresosValue <= 0) return;

        const totalGastos = Array.from(gastosInputs).reduce((sum, input) => sum + Number(input.value), 0);

        if (totalGastos > ingresosValue) {
            alert("El total de gastos no puede superar los ingresos.");

            for (let i = gastosInputs.length - 1; i >= 0; i--) {
                const input = gastosInputs[i];
                const gasto = Number(input.value);

                if (gasto > 0) {
                    input.value = "";
                    break;
                }
            }
        }
    }

    ingresosInput.addEventListener("input", validateGastosVsIngresos);
    gastosInputs.forEach((input) => {
        input.addEventListener("input", validateGastosVsIngresos);
    });
});