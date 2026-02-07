
function TitleDescription({ title, description, className }) {
    return (
        <div className={className}>
            <h1 className="text-lg">{title}</h1>
            <p className="text-muted-foreground pt-2">{description}</p>
        </div>
    )
}

export default TitleDescription