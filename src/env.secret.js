// use dev or prod variables
import { INSIDE_OCR_SERVER_URL, INSIDE_SUBSCRIPTION_KEY } from "./env.production"
//import { INSIDE_OCR_SERVER_URL, INSIDE_SUBSCRIPTION_KEY } from "./env.development"

export const OCR_SERVER_URL = INSIDE_OCR_SERVER_URL
export const SUBSCRIPTION_KEY = INSIDE_SUBSCRIPTION_KEY
