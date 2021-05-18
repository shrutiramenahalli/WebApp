import React, { useState } from 'react';
import './App.css';

// Import Amplify and Storage
import Amplify from 'aws-amplify';
// withAuthenticator is a higher order component that wraps the application with a login page
import { withAuthenticator } from '@aws-amplify/ui-react';
// Import the project config files and configure them with Amplify
import awsconfig from './aws-exports';
import Storage from '@aws-amplify/storage';


Amplify.configure(awsconfig);

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = async (e) => {
   
    const file = e.target.files[0];
        
    try {
      
      if (file && file.length > 0) {
        const fil = file[0];
        this.setState({ fil });
     }
    
      setLoading(true);
      console.log("Success")
      // Upload the file to s3 with private access level. 
      await Storage.put(file.name, file, {
        level: 'private',
        
      });
      // Retrieve the uploaded file to display
      const url = await Storage.get(file.name, { level: 'private' })
      setImageUrl(url);
      setLoading(false);
  
      
    } catch (err) {
      console.log(err);
    }
  }
  
  
  const downloadUrl = async () => {
    // Creates download url that expires in 5 minutes/ 300 seconds
    const downloadUrl = await Storage.get('picture.jpg', { expires: 300 });
    window.location.href = downloadUrl
    debugger;
    
  }

  const readFromStorage = () => {
    Storage.list('javascript/')
      .then(data => console.log('data from S3: ', data))
      .catch(err => console.log('error'))
  }
  
  return (
    <div className="App">
      <h1> Upload Files </h1>
      {loading ? <h3>Uploading...</h3> : <input
        type="file" accept='image/jpg'
        onChange={(evt) => handleChange(evt)}
      />}
      <div>
               
      </div>
      <div>
        <h2>Download Files</h2>
        <button onClick={() => readFromStorage()}>Click Here!</button>

      </div>
    </div>
    
  );
      
}

// withAuthenticator wraps your App with a Login component
export default withAuthenticator(App);