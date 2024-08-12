import './HueGuessr.scss'
import { useState } from 'react'

const HueGuessr = () => {
    const generateRandomHue = () => {
        let result = '#'
        const characters = '0123456789ABCDEF'
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * 16))
        }
        return result
    }

    const [color, setColor] = useState(generateRandomHue())
    const [guessedColor, setGuessedColor] = useState('#222222')
    const [hueGuess, setHueGuess] = useState('#222222')
    const [guessed, setGuessed] = useState(false)

    const getNewColor = () => {
        setColor(generateRandomHue())
    }

    const isValidHex = (str) => /[A-F0-9]+$/.test(str);

    const onInputChange = (e) => {
        const value = e.target.value.toUpperCase().slice(1)
        if (!isValidHex(value) && value != "") return;
        setHueGuess(`#${value}`)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setGuessedColor(hueGuess)
        setGuessed(true)
    }

    return (
        <div className="margin-left hueguessr-wrapper">
            <h1>HueGuessr</h1>
            <div className="description">
                <h4>Objective:</h4>
                <p>You&apos;ll be shown a color. Your objective is to type in a Hue value and get as close to that color as possible!</p>
            </div>
            <div className='game'>
                <div className='hint'>
                    <h3>Color:</h3>
                    <div className='color-box' style={{ backgroundColor: color }}></div>
                    <div className='answer'>
                        {guessed && (<p>Answer: {color}</p>)}
                        {guessed && (<button className='restart-button' onClick={() => {
                            setGuessed(false)
                            getNewColor()
                            setGuessedColor('#222222')
                            setHueGuess('#222222')
                        }}>Restart</button>)}
                    </div>
                </div>
                <div className='input'>
                    <h3>Guess:</h3>
                    <div className='color-box' style={{ backgroundColor: guessedColor }}></div>
                    <div className='submit-guess'>
                        {!guessed && (<form onSubmit={handleFormSubmit}>
                            <input onChange={onInputChange} value={hueGuess} maxLength={7} />
                            <button type="submit">Guess</button>
                        </form>)}
                        {guessed && (<p>
                            Your answer: {hueGuess}
                        </p>)}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HueGuessr