export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getRemainingTrialMs = (trialEndDate) => {
  if (!trialEndDate) {
    return 0;
  }

  return Math.max(new Date(trialEndDate).getTime() - Date.now(), 0);
};
