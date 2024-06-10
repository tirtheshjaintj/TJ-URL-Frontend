import axios from "axios";
const fetchUserLocation = async () => {
    try {
        const { data } = await axios.get('https://ipinfo.io/json');
        console.log(data);
        return data;
    } catch (error) {
        return {};
    }
};
fetchUserLocation();