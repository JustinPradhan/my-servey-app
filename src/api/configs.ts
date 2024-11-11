interface EnvVariables {
  VITE_REACT_APP_USER_API_URL: string;
  VITE_REACT_APP_MAIN_API_URL: string;
  VITE_REACT_APP_INVENTORY_API_URL:string;
  VITE_REACT_APP_DOC_API_URL:string;
  // Add other variables as needed
}

// Export the environment variables
const envVariables: EnvVariables = {
  VITE_REACT_APP_USER_API_URL: import.meta.env.VITE_REACT_APP_USER_API_URL || '',
  VITE_REACT_APP_MAIN_API_URL: import.meta.env.VITE_REACT_APP_MAIN_API_URL || '',
  VITE_REACT_APP_INVENTORY_API_URL: import.meta.env.VITE_REACT_APP_INVENTORY_API_URL || '',
  VITE_REACT_APP_DOC_API_URL: import.meta.env.VITE_REACT_APP_DOC_API_URL || '',
  // Add other variables as needed
};

export default envVariables;
