import {BASE_URL} from "./index";

export const updateVehicle = async (vehicle) => {
    console.log("@/api/auth/updateVehicle ⟼ accessed. vehicle Data is: ", vehicle);
    try {
        const response = await fetch(`${BASE_URL}/captain/vehicle`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                type: vehicle.type,
                number: vehicle.number,
                model: vehicle.model,
                colors: vehicle.colors
            }),
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            return {success: false, errorMessage: data.message, errorStatus: response.status};
        }
        return {success: true, data};
    } catch (error) {
        console.log(error);
        return {success: false, errorMessage: "Network error", errorStatus: 0};
    }
}