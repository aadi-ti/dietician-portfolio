document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('nutrition-form');
  const submitBtn = form?.querySelector('button[type="submit"]');

  async function handleSubmit(e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);
      const file = formData.get('reportFile');
      let reportUrl = null;

      if (file && file.size > 0) {
        const fileName = `reports/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await window.supabase
          .storage
          .from(window.SUPABASE_BUCKET)
          .upload(fileName, file);

        if (uploadError) {
          throw new Error("Failed to upload report: " + uploadError.message);
        }

        const { data: { publicUrl } } = window.supabase
          .storage
          .from(window.SUPABASE_BUCKET)
          .getPublicUrl(fileName);

        reportUrl = publicUrl;
      }

      const getCheckboxValues = (name) =>
        [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);

      const getRadioValue = (name) => {
        const selected = form.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
      };

      const payload = {
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age') ? parseInt(formData.get('age')) : null,
        gender: formData.get('gender'),
        height: formData.get('height'),
        weight: formData.get('weight'),
        health_goals: getCheckboxValues('healthGoals'),
        health_goals_other: formData.get('healthGoalsOther'),
        activity_level: getRadioValue('activityLevel'),
        diet: getCheckboxValues('diet'),
        diet_other: formData.get('dietOther'),
        allergies: formData.get('allergies'),
        meals_per_day: formData.get('mealsPerDay'),
        water_intake: formData.get('waterIntake'),
        supplements: formData.get('supplements'),
        conditions: getCheckboxValues('conditions'),
        conditions_other: formData.get('conditionsOther'),
        medications: formData.get('medications'),
        family_history: formData.get('family history'),
        reports: reportUrl,
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await window.supabase
        .from('client_intake')
        .insert([payload])
        .select();

      if (error) {
        console.error("Insert Error:", error);
        alert("Error submitting form. Check console.");
        return;
      }

      console.log("✅ Data inserted:", data);

      // Call Netlify Function to send email
      await sendConfirmationEmail(payload.full_name, payload.email);

      alert("✅ Form submitted successfully!");
      form.reset();
      window.location.href = "index.html";

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  }

  async function sendConfirmationEmail(name, email) {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const result = await res.json();
      console.log("Email result:", result);
    } catch (err) {
      console.error("Email error:", err);
    }
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
