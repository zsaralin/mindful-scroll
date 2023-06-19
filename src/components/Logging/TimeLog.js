import {ref} from "firebase/storage";
import {UID} from "./Logging";

export function logIdString(){
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based, so we add 1
    const year = today.getFullYear() ;
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    return`${UID}_${year}_${day}_${month}_${minutes}_${seconds}`
}