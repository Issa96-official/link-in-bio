import '../styles/Footer.scss'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <p>© {currentYear} Issa Alissa. All rights reserved.</p>
    </footer>
  )
}

export default Footer
