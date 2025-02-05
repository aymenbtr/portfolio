// api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { full_name, email, subject, message } = req.body;
      
      // Validate required fields
      if (!full_name || !email || !subject || !message) {
        return res.status(400).json({ 
          status: 'error',
          message: 'All fields are required' 
        });
      }
  
      // Create message object
      const newMessage = {
        id: Date.now(),
        full_name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      };
  
      // Store in database or localStorage
      // For this example, we'll use localStorage on the client side
      
      return res.status(200).json({ 
        status: 'success',
        message: 'Message sent successfully',
        data: newMessage
      });
  
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ 
        status: 'error',
        message: 'Something went wrong' 
      });
    }
  }