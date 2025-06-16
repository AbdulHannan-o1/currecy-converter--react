import CurrencySelect from "./CurrencySelect"
import React, { useEffect, useState } from 'react';
function ConverterForm() {
    const [amount, setAmount] = useState(100);
    const[fromCurrency, setFromCurrency] = useState('USD');
    const[toCurrency, setToCurrency] = useState('PKR');
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Function to swap currencies
    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }
    // Function to fetch exchange rate
    const getExchangeRate = async () => {
      const API_Key = import.meta.env.VITE_API_Key;
      const API_URL = `https://v6.exchangerate-api.com/v6/${API_Key}/pair/${fromCurrency}/${toCurrency}`;

      setIsLoading(true);
      try{
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("somthing went wrong");
        var data = await response.json();
        const rate = (data.conversion_rate*amount).toFixed(2);
        // console.log("Exchange Rate:", rate);      
        setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
      }  catch (error) {
        console.log("Error fetching exchange rate:", error);
      }finally{
        setIsLoading(false);
      }
    }
    //  Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      getExchangeRate();
    }
    useEffect(() => getExchangeRate, []);

  return (
       <form  className="converterForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label className="form-label">Enter Amount</label>
          <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} required/>
        </div>
        <div className="formGroup form-currency-group">
          <div className="form-section">
            <label  className="form-label">Form</label>
            <CurrencySelect
              selectedCurrency={fromCurrency}
              handleCurrencyChange={(e) => setFromCurrency(e.target.value)}
            />
          </div>

          <div className="swap-icon" onClick={handleSwapCurrencies}>
            <i className="bi bi-arrow-left-right" style={{ fontSize: '24px' }}></i>
          </div>

          <div className="form-section">
            <label  className="form-label">To</label>
            <CurrencySelect
              selectedCurrency={toCurrency} 
              handleCurrencyChange={(e) => setToCurrency(e.target.value)}
            />
          </div>
         
        </div>
         <button type='submit' className={`${isLoading ? "Loading" : "submit-button"}`}>Get Exchange Rate</button>

          <p className="exchange-rate">
            {isLoading ?"Getting exchange rate...": result}
          </p>
      </form>
  )
}
export default ConverterForm
