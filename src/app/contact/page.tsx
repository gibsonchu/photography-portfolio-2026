import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="contact-layout">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Available for events, portraits, and documentary commissions.</h1>
          <p>
            Share the shape of the project, the date, location, and what you
            want the photographs to remember.
          </p>
        </div>
        <form className="inquiry-form" action="/api/contact" method="post">
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Type of shoot
            <select name="shootType" required defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              <option>Event</option>
              <option>Portrait</option>
              <option>Editorial / Documentary</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Date of shoot
            <input name="shootDate" type="date" />
          </label>
          <label>
            Location
            <input name="location" />
          </label>
          <label>
            Budget range
            <input name="budget" />
          </label>
          <label className="span-all">
            Message
            <textarea name="message" rows={6} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>
    </PageShell>
  );
}
