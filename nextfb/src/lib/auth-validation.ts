const emailPattern = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function isValidEmail(email: string) {
    return email.length <= 254 && email.indexOf('@') <= 64 && emailPattern.test(email);
}

export function isValidSignupPhone(phone: string) {
    return phone.length === 10 && /^[0-9]{10}$/.test(phone);
}
