'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Droplet, Sparkles, Sun, Calendar, Phone, Mail, MapPin, Clock, Moon, LightbulbIcon, Check } from 'lucide-react'
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { sendContactForm } from '../src/app/actions/email'

const services = [
  {
    title: "Exterieur Reiniging",
    icon: <Car className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
    options: [
      { name: "Basis", price: 49.99, time: 60, features: ["Handwas", "Velgen reinigen", "Ramen wassen"] },
      { name: "Premium", price: 79.99, time: 90, features: ["Alles van Basis", "Kleibehandeling", "Waxen"] },
      { name: "Deluxe", price: 119.99, time: 120, features: ["Alles van Premium", "Dieptereiniging", "Keramische coating"] }
    ]
  },
  {
    title: "Interieur Reiniging",
    icon: <Droplet className="w-8 h-8 text-green-500 dark:text-green-400" />,
    options: [
      { name: "Basis", price: 39.99, time: 45, features: ["Stofzuigen", "Oppervlakken reinigen", "Ramen van binnen"] },
      { name: "Premium", price: 69.99, time: 75, features: ["Alles van Basis", "Diepte reiniging stoelen", "Luchtverfrisser"] },
      { name: "Deluxe", price: 99.99, time: 105, features: ["Alles van Premium", "Leder behandeling", "Ozonbehandeling"] }
    ]
  },
  {
    title: "Auto Polijsten",
    icon: <Sparkles className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
    options: [
      { name: "Basis", price: 89.99, time: 90, features: ["Eénstaps polijstproces", "Lichte krasjes verwijderen", "Basis glans"] },
      { name: "Premium", price: 149.99, time: 150, features: ["Tweestaps polijstproces", "Diepere krassen behandelen", "Hoge glans"] },
      { name: "Deluxe", price: 199.99, time: 210, features: ["Driestaps polijstproces", "Zware oxidatie verwijderen", "Showroom finish"] }
    ]
  },
  {
    title: "Koplampen Polijsten",
    icon: <Sun className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />,
    price: 59.99,
    time: 45,
    description: "Herstel de helderheid van uw koplampen voor betere zichtbaarheid."
  },
  {
    title: "Maandelijkse Reiniging",
    icon: <Calendar className="w-8 h-8 text-red-500 dark:text-red-400" />,
    price: 129.99,
    time: 120,
    description: "Regelmatige basis- en interieurreiniging om uw auto in topconditie te houden."
  }
]

const carAnimation = {
  initial: { x: -10 },
  animate: { 
    x: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licensePlate: '',
    selectedServices: [],
    date: '',
    time: '',
    comments: ''
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleServiceSelection = (serviceTitle: string, optionName: string) => {
    setFormData(prevData => {
      const updatedServices = [...prevData.selectedServices]
      const existingIndex = updatedServices.findIndex(s => s.title === serviceTitle)
      
      if (existingIndex !== -1) {
        if (optionName) {
          updatedServices[existingIndex] = { title: serviceTitle, option: optionName }
        } else {
          updatedServices.splice(existingIndex, 1)
        }
      } else if (optionName) {
        updatedServices.push({ title: serviceTitle, option: optionName })
      }

      return { ...prevData, selectedServices: updatedServices }
    })
  }

  const calculateTotalPrice = () => {
    return formData.selectedServices.reduce((total, service) => {
      const serviceData = services.find(s => s.title === service.title)
      if (serviceData.options) {
        const option = serviceData.options.find(o => o.name === service.option)
        return total + option.price
      }
      return total + serviceData.price
    }, 0)
  }

  const calculateTotalTime = () => {
    return formData.selectedServices.reduce((total, service) => {
      const serviceData = services.find(s => s.title === service.title)
      if (serviceData.options) {
        const option = serviceData.options.find(o => o.name === service.option)
        return total + option.time
      }
      return total + serviceData.time
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await sendContactForm(formData)
      
      if (result.success) {
        toast({
          title: "Afspraak gemaakt",
          description: "We hebben uw aanvraag ontvangen en nemen spoedig contact met u op.",
        })
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licensePlate: '',
          selectedServices: [],
          date: '',
          time: '',
          comments: ''
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw of neem telefonisch contact met ons op.",
        variant: "destructive",
      })
    }
  }

  const getAvailableTimeSlots = (date: string) => {
    const selectedDate = new Date(date)
    const dayOfWeek = selectedDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    const startHour = isWeekend ? 8 : 18
    const startMinute = isWeekend ? 0 : 30
    const endHour = 22

    const timeSlots = []
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === startHour && minute < startMinute) continue
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        timeSlots.push(time)
      }
    }

    return timeSlots
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4 sm:gap-0">
            <Button
              className={buttonVariants({ variant: "ghost", size: "lg", className: "flex items-center space-x-2 hover:bg-transparent" })}
              onClick={() => scrollToSection('home')}
            >
              <motion.div
                initial="initial"
                animate="animate"
                variants={carAnimation}
              >
                <Car className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>
              <span className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                RM-CarCleaning
              </span>
            </Button>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {['home', 'diensten', 'over-ons', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section 
                      ? (darkMode ? 'text-blue-400' : 'text-blue-600')
                      : (darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <div className="flex items-center space-x-2">
                <LightbulbIcon className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className={`${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
                <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimatePresence>
          <motion.section
            id="home"
            className="text-center mb-16 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-removebg-preview-AayABLP7GvncTTmGGHmS42P9WXUvwZ.png"
                alt="RM-CarCleaning Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className={`text-lg sm:text-xl text-gray-700 dark:text-gray-200`}>
              Professionele autodetailing op locatie in Omgeving Altena, Noord-Brabant
            </p>
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            id="diensten"
            className="mb-16 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>Onze Diensten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {services.map((service, index) => (
                <Card key={index} className={`transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                  <CardHeader>
                    <div className="flex flex-col items-center justify-center text-center">
                      {service.icon}
                      <CardTitle className="text-xl font-semibold mt-2">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {service.options ? (
                      <div>
                        {service.options.map((option, optIndex) => (
                          <div key={optIndex} className="mb-4 last:mb-0">
                            <h4 className="font-semibold text-center">{option.name} - €{option.price.toFixed(2)}</h4>
                            <p className="text-sm text-center text-gray-700 dark:text-gray-200">
                              Geschatte tijd: {option.time} minuten
                            </p>
                            <ul className="space-y-2 mt-2">
                              {option.features.map((feature, featIndex) => (
                                <li key={featIndex} className="flex items-center space-x-2">
                                  <Check className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-semibold mb-2">€{service.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          Geschatte tijd: {service.time} minuten
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">{service.description}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className={buttonVariants({ variant: "default", size: "lg", className: "w-full" })}>
                      Reserveer Nu
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            id="over-ons"
            className="mb-16 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>Over Ons</h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-4 sm:p-8`}>
              <p className={`text-gray-700 dark:text-gray-200 mb-4`}>
                RM-CarCleaning is opgericht in 2020 door een team van gepassioneerde autoliefhebbers met jarenlange ervaring in de autodetailing industrie. Ons doel is om topkwaliteit autodetailing services aan te bieden, direct bij u aan huis of op locatie.
              </p>
              <p className={`text-gray-700 dark:text-gray-200 mb-4`}>
                We zijn trots op onze aandacht voor detail en ons streven naar perfectie. Ons team gebruikt alleen de beste producten en nieuwste technieken om ervoor te zorgen dat uw auto er niet alleen geweldig uitziet, maar ook optimaal beschermd is.
              </p>
              <p className={`text-gray-700 dark:text-gray-200`}>
                Bij RM-CarCleaning geloven we dat elke auto, ongeacht leeftijd of model, de best mogelijke verzorging verdient. Of u nu een dagelijkse rijder heeft of een exclusieve sportwagen, wij behandelen elke auto met dezelfde toewijding en zorg.
              </p>
            </div>
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            id="contact"
            className="pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>Maak een Afspraak</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
                <CardHeader>
                  <CardTitle>Contactgegevens</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Neem contact met ons op of plan direct een afspraak</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>+31 20 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>info@rm-carcleaning.nl</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>Omgeving Altena, Noord-Brabant</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>Ma-Vr: 18:30 - 22:00, Za-Zo: 8:00 - 22:00</span>
                  </div>
                </CardContent>
              </Card>
              <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
                <CardHeader>
                  <CardTitle>Afspraak Formulier</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Vul het formulier in en wij nemen spoedig contact met u op</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        placeholder="Voornaam"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={darkMode ? 'bg-gray-700 text-white' : ''}
                      />
                      <Input
                        name="lastName"
                        placeholder="Achternaam"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={darkMode ? 'bg-gray-700 text-white' : ''}
                      />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="E-mailadres"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-gray-700 text-white' : ''}
                    />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Telefoonnummer"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-gray-700 text-white' : ''}
                    />
                    <Input
                      name="licensePlate"
                      placeholder="Kenteken"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-gray-700 text-white' : ''}
                    />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="services">
                        <AccordionTrigger>Selecteer Diensten</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {services.map((service, index) => (
                              <div key={index} className="space-y-2">
                                <h4 className="font-semibold">{service.title}</h4>
                                {service.options ? (
                                  service.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${service.title}-${option.name}`}
                                          checked={formData.selectedServices.some(s => s.title === service.title && s.option === option.name)}
                                          onCheckedChange={(checked) => handleServiceSelection(service.title, checked ? option.name : '')}
                                        />
                                        <label htmlFor={`${service.title}-${option.name}`} className="text-sm">
                                          {option.name}
                                        </label>
                                      </div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        €{option.price.toFixed(2)} ({option.time} min)
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={service.title}
                                        checked={formData.selectedServices.some(s => s.title === service.title)}
                                        onCheckedChange={(checked) => handleServiceSelection(service.title, checked ? 'default' : '')}
                                      />
                                      <label htmlFor={service.title} className="text-sm">
                                        {service.title}
                                      </label>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      €{service.price.toFixed(2)} ({service.time} min)
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {formData.selectedServices.length > 0 && (
                      <div className="text-right">
                        <p className="font-semibold">Totale prijs: €{calculateTotalPrice().toFixed(2)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Geschatte totale tijd: {calculateTotalTime()} minuten</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={darkMode ? 'bg-gray-700 text-white' : ''}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Select 
                        name="time"
                        value={formData.time}
                        onValueChange={(value) => handleInputChange({ target: { name: 'time', value } } as any)}
                        disabled={!formData.date}
                      >
                        <SelectTrigger className={darkMode ? 'bg-gray-700 text-white' : ''}>
                          <SelectValue placeholder="Kies een tijd" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.date && getAvailableTimeSlots(formData.date).map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      name="comments"
                      placeholder="Aanvullende opmerkingen"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className={darkMode ? 'bg-gray-700 text-white' : ''}
                    />
                    <Button className={buttonVariants({ variant: "default", size: "lg", className: "w-full" })}>Verstuur Aanvraag</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-700 dark:text-gray-200">
          <p>&copy; 2024 RM-CarCleaning. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  )
}