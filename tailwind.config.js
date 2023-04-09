/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '102':'25rem',
        '114': '32rem',
        '128': '42rem',
      }
    },
  },
  daisyui: {
    themes: [{
      light: {
        "primary": "#f4e47a",
        "secondary": "#20707c",        
        "accent": "#eaa6da",          
        "neutral": "#181818",             
        "base-100": "#f3f4f6",           
        "info": "#9BD7E4",          
        "success": "#25DACB",              
        "warning": "#B9940E",           
        "error": "#F75E82",
        "normal": "#000000",
      },
      dark: {
        "primary": "#8851d6",   
        "secondary": "#ff9800",          
        "accent": "#5047ef",          
        "neutral": "#f3f4f6",            
        "base-100": "#000000",       
        "info": "#84D0F6",    
        "font": "#000000",      
        "success": "#24A388",            
        "warning": "#F4D366",            
        "error": "#EF2565",
        "normal": "#ffffff",
    },
  }
  ],
  },
  plugins: [require("daisyui")],
}