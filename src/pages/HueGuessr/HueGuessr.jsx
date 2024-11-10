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

    const [color, setColor] = useState(generateRandomHue());
    const [guessedColor, setGuessedColor] = useState('#222222');
    const [hueGuess, setHueGuess] = useState('#222222');
    const [guessed, setGuessed] = useState(false);
    const [accuracy, setAccuracy] = useState(0);

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
        setAccuracy(calculateAccuracy(color, hueGuess))
    }

    const hexToRgb = (hex) => {
        let fullHex = hex;
        if (hex.length === 4) { // for shorter hex values e.g. #fff or #000
            fullHex = hex.split('');
            fullHex = fullHex[0] + fullHex[1] + fullHex[1] + fullHex[2] + fullHex[2] + fullHex[3] + fullHex[3];
        }
        const r = parseInt(fullHex.slice(1, 3), 16);
        const g = parseInt(fullHex.slice(3, 5), 16);
        const b = parseInt(fullHex.slice(5, 7), 16);
        return { r, g, b };
    }

    const calculateAccuracy = (color, targetColor) => {
        const colorRgb = hexToRgb(color)
        const targetColorRgb = hexToRgb(targetColor)
        const rDiff = Math.abs(colorRgb.r - targetColorRgb.r)
        const gDiff = Math.abs(colorRgb.g - targetColorRgb.g)
        const bDiff = Math.abs(colorRgb.b - targetColorRgb.b)
        const totalDiff = rDiff + gDiff + bDiff
        const accuracy = 100 - (totalDiff / 765 * 100)
        return accuracy.toFixed(2)
    }

    return (
        <div className="hueguessr-wrapper pt-4 w-full h-fit m-auto">
            <h1 className='text-2xl w-fit mx-auto'>HueGuessr</h1>
            <div className="description mx-auto">
                <h4 className='w-fit m-auto '>Objective:</h4>
                <p>You&apos;ll be shown a color. Your objective is to type in a Hex value and get as close to the target color as possible!</p>
            </div>
            <div className='game m-auto flex flex-col sm:flex-row pt-2'>
                <div className='hint w-1/2 flex flex-col items-center pb-5 mx-auto'>
                    <h3>Color:</h3>
                    <div className='color-box w-full rounded' style={{ backgroundColor: color }}></div>
                    <div className='answer pt-2 flex flex-col'>
                        {guessed && (<div className='stats flex'>
                            <p>Answer: {color}</p>
                            <p className='text-right'>Accuracy: {accuracy}%</p>
                        </div>)}
                    </div>
                </div>
                <div className='input flex flex-col items-center mx-auto'>
                    <h3>Guess:</h3>
                    <div className='color-box w-full rounded' style={{ backgroundColor: guessedColor }}></div>
                    <div className='flex flex-col w-full submit-guess pt-1'>
                        {guessed && (<button className='restart-button rounded h-7' onClick={() => {
                            setGuessed(false)
                            getNewColor()
                            setGuessedColor('#222222')
                            setHueGuess('#222222')
                        }}>Restart</button>)}
                        {!guessed && (<form onSubmit={handleFormSubmit} className='flex h-7 justify-between'>
                            <input onChange={onInputChange} value={hueGuess} maxLength={7} className='rounded h-full mt-0.5 pl-1 pb-0.5' />
                            <button type="submit" className='rounded h-full mt-0.5'>Guess</button>
                        </form>)}
                        {guessed && (<p className='text-center'>
                            Your answer: {hueGuess}
                        </p>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HueGuessr