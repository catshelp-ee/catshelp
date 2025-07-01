import moment from "moment";

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parsed = moment(dateString, "DD.MM.YYYY");
  return parsed.isValid() ? parsed.toDate() : null;
}

export const calculateAge = (birthDateString: string): string => {
  if (!birthDateString) return "";
  
  const birthDate = moment(birthDateString, "DD.MM.YYYY");
  if (!birthDate.isValid()) return "";
  
  const now = moment();
  const years = now.diff(birthDate, "years");
  const months = now.diff(birthDate.clone().add(years, "years"), "months");

  if (years === 0) return `${months} kuud`;
  if (months === 0) return `${years} aastat`;
  return `${years} aastat ja ${months} kuud`;
}

export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const formattedDate = dateString.replaceAll(".", "-");
  return moment().isBefore(moment(formattedDate, "DD-MM-YYYY"));
}

export const parseEstonianDate = (dateString: string): Date | null => {
  try {
      const [day, month, year] = dateString.split(".").map(Number);
      if (!day || !month || !year) return null;
      return new Date(Date.UTC(year, month - 1, day));
  } catch {
      return null;
  }
}

export const formatEstonianDate = (date: Date): string => {
    return date.toLocaleDateString("et-EE");
}
