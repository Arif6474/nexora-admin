

function ScreenWrapper({ children, paddingTop = true }) {
    return (
        <div className={`px-4 md:px-8 ${paddingTop ? 'pt-4' : ''}`}>
            {children}
        </div>
    )
}

export default ScreenWrapper