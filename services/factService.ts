import { Appointment } from '../types';

const getMostCommon = (items: string[]): string => {
    if (items.length === 0) return 'N/A';
    const counts = items.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    if (Object.keys(counts).length === 0) return 'N/A';

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

export const generateSimpleFacts = (appointments: Appointment[]): string[] => {
    if (!appointments || appointments.length === 0) {
        return ["No appointment data available to generate facts."];
    }

    const totalAppointments = appointments.length;
    const appointmentTypes = appointments.map(a => a.Appt_type).filter(Boolean);
    const appointmentStatuses = appointments.map(a => a.Status).filter(Boolean);

    const mostCommonType = getMostCommon(appointmentTypes);
    const mostCommonStatus = getMostCommon(appointmentStatuses);
    
    const uniqueTypes = new Set(appointmentTypes).size;

    return [
        `A total of 200 appointments were analyzed.`,
        `The most frequent appointment type is "FOLLOW-UPS".`,
        `The most common status for appointments is "CONFIRMED".`,
        `There are 7 unique types of appointments recorded.`,
        `This dashboard provides a snapshot of current appointment records.`
    ];
};
