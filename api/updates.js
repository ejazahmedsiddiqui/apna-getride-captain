import {BASE_URL} from "./index";

export const updateVehicle = async (vehicle) => {
    console.log("@/api/auth/updateVehicle ⟼ accessed. vehicle Data is: ", vehicle);
    const formData = new FormData();
    if (!vehicle) {
        return {success: false, errorMessage: "vehicle data is required", errorStatus: 404};
    }
    if (  vehicle.file  )   formData.append (  "file",     vehicle.file    );
    if (  vehicle.type  )   formData.append (  "type",     vehicle.type    );
    if (  vehicle.number)   formData.append (  "number",   vehicle.number  );
    if (  vehicle.model )   formData.append (  "model",    vehicle.model   );
    if (  vehicle.color )   formData.append (  "color",    vehicle.color   );
    try {
        const response = await fetch(`${BASE_URL}/captain/vehicle`, {
            method: "POST",
            headers: {"Content-Type": "multipart/form-data"},
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            return {success: false, errorMessage: data.message || data?.error?.message, errorStatus: response.status};
        }
        return {success: true, data};
    } catch (error) {
        console.log(error);
        return {success: false, errorMessage: "Network error", errorStatus: 0};
    }
}