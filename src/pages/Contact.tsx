import React, { useState } from 'react';
import { Mail, MapPin, Send, Check, ArrowUpRight } from 'lucide-react';
import SectionMarker from '@/components/SectionMarker';

const Contact: React.FC = () => {
  interface FormData {
    name: string;
    email: string;
    message: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await submitForm(formData, setFormSubmitted);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const submitForm = async (
    formData: FormData,
    setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const dataToSubmit = new FormData();

    try {
      for (const key of Object.keys(formData) as (keyof FormData)[]) {
        dataToSubmit.append(key, formData[key]);
      }

      const response = await fetch(
        import.meta.env.VITE_GOOGLE_SHEET_WEB_URL!,
        {
          method: 'POST',
          mode: 'cors',
          body: dataToSubmit,
        }
      );

      console.log(response);

      if (response.ok) {
        setFormSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormSubmitted(true);
    }
  };

  const inputClassName =
    'block w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 transition-colors';

  const labelClassName =
    'block font-mono text-xs uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400';

  return (
    <div className="overflow-hidden text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative border-b border-gray-200 dark:border-gray-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 gap-12 sm:py-20 lg:px-12">
          <div className="mb-8 flex items-center gap-5">
            <span className="font-mono-label text-foreground/70 mt-1.5">/ Contact</span>
            {/* <SectionMarker label="Our Technology" index={5} /> */}
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Get in{' '}
            <span className="drift-text bg-clip-text text-transparent">
              touch.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
            Have questions about our AI solutions or services? We're here to
            help. Reach out and tell us what you're working on. We'll get back
            to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-y-12 gap-x-12">
            {/* Studio information */}
            <aside className="lg:col-span-4">
              <span className={labelClassName}>/ Studio</span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Let's start a conversation.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400">
                Whether you have a project in mind, a question about our
                services, or an idea you'd like to explore, we'd love to hear
                from you.
              </p>

              <div className="mt-12 space-y-2.5">
                <a
                  href="mailto:mail@madnesslab.dev"
                  className="group flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-colors group-hover:border-indigo-300 dark:border-gray-800 dark:group-hover:border-indigo-500/50">
                    <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  </span>

                  <span>mail@madnesslab.dev</span>

                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </a>

                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800">
                    <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </span>

                  <span>Barranquilla, Colombia</span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-200 pt-6 dark:border-gray-800">
                <span className={labelClassName}>/ Response time</span>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  We review incoming inquiries and will get back to you as soon
                  as possible.
                </p>
              </div>
            </aside>

            {/* Contact form */}
            <div className="lg:col-span-8 mt-12">
              {formSubmitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50/70 p-8 text-center dark:border-gray-800 dark:bg-gray-900/40 sm:p-12"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                    <Check className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight sm:text-2xl">
                    Thank you for reaching out.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400">
                    We answer all email and requests as they come in. We'll
                    get back to you as soon as possible. Thank you!
                  </p>

                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <span aria-hidden="true">←</span>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClassName}>
                        Name
                      </label>

                      <input
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClassName}>
                        Email
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClassName}>
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, your workflows, and what you'd like to build..."
                      className={`${inputClassName} resize-y`}
                    />
                  </div>

                  <button
                    id="form-submit"
                    aria-label="form-submit"
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-indigo-400 dark:hover:text-white dark:focus-visible:ring-offset-gray-950"
                  >
                    Send Message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>

                  <p className="text-xs leading-5 text-gray-500 dark:text-gray-500">
                    By submitting this form, your inquiry will be sent for
                    processing.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;