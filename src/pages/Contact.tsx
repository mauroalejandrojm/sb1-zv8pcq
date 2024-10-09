import React, {useState} from 'react'
import { Mail, MapPin } from 'lucide-react'



const Contact: React.FC = () => {

  interface FormData {
    name: string;
    email: string;
    message: string;
  }
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission (you can add your logic here to send the data)
    console.log("Form submitted!");
    try {
        await submitForm(formData, setFormSubmitted);
        setFormData({ name: '', email: '', message: '' });
    } catch (error) {
        console.error('Error submitting form:', error);
    }
  };

  const submitForm = async (formData: FormData,
    setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>) => {
    
    const dataToSubmit = new FormData();
    try {
      for (const key of Object.keys(formData) as (keyof FormData)[]) {
          dataToSubmit.append(key, formData[key]);
      }
      
      const response = await fetch(import.meta.env.VITE_GOOGLE_SHEET_WEB_URL!,
          {
              method: 'POST',
              mode: 'cors',
              body: dataToSubmit,
          }
      );

      if (response.ok) {
          setFormSubmitted(true);
      }
    } catch (error) {
        
        setFormSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions about our AI solutions or services? We're here to help. Reach out to us using the contact information below or fill out the form, and we'll get back to you as soon as possible.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">madnesslabdev@gmail.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Barranquilla, Colombia</span>
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div>
              <button 
              type="submit"
              className={`w-full btn btn-primary ${formSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={formSubmitted}
              >{formSubmitted ? 'Message Sent!' : 'Send Message'}
              </button>
              {formSubmitted && (
                  <div className="text-sm font-bold text-indigo-900 dark:text-gray-300 text-center mt-8">
                      We answer all email and requests as they come in. 
                      We’ll get back to you as soon as possible. Thank you!
                  </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact