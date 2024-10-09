
/** @type {import('tailwindcss').Config} */
export default {
 corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
        colors: {
            scandiweb: {
                black: "#1D1F22",
                lightgreen: "#5ECE7B"
            }        
        },
        fontFamily: {
            raleway: ["Raleway", "Roboto", "sans-serif"],
            roboto: ["Roboto", "sans-serif"]
        }
    },
     

  },
  
    
  plugins: [],
    
}
 
