export const verifyTurnstileToken = async (token: string) => {
  const response = await fetch(
    `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
    {
      method: "POST",
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, token }),
    }
  );

  const data = await response.json();
  return data.success;
};
