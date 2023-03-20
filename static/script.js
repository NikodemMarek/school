const CommentForm = ({onSubmit}) => {
    const [comment, setComment] = React.useState('')

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit(comment)
                setComment('')
            }}
        >
            <input
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type='submit'>Submit</button>
        </form>
    )
}

const Comments = ({comments}) => (
    <div>
        {comments.map((comment, key) => (
            <div key={key}>
                <div>{comment.comment}</div>
                <div>{comment.userId}</div>
            </div>
        ))}
    </div>
)

const Thread = async ({id}) => {
    const comments = await fetch(`/thread?id=${id}`).then((res) => res.json())

    return (
        <div>
            <Comments comments={comments} />

            <CommentForm
                onSubmit={async (comment) => {
                    const newComment = await fetch(`/thread?id=${id}`, {
                        method: 'POST',
                        body: JSON.stringify({comment}),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then((res) => res.json())
                }}
            />
        </div>
    )
}

const Threads = ({threads, changeThread, createThread}) => {
    const [selectedThread, setSelectedThread] = React.useState(threads[0].id)
    const [newThread, setNewThread] = React.useState('')

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    changeThread(selectedThread)
                }}
            >
                <select onChange={(e) => setSelectedThread(e.target.value)}>
                    {threads.map(({id, name}, key) => (
                        <option key={key} value={id}>
                            {name}
                        </option>
                    ))}
                </select>

                <button type='submit'>show</button>
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    createThread(newThread)
                }}
            >
                <input
                    type='text'
                    onChange={(e) => setNewThread(e.target.value)}
                />
                <button type='submit'>create</button>
            </form>
        </>
    )
}

const UI = () => {
    const [selectedThread, setSelectedThread] = React.useState(null)
    const [threads, setThreads] = React.useState(null)

    React.useEffect(() => {
        fetch('/threads')
            .then((res) => res.json())
            .then((threads) => {
                setThreads(threads)
                setSelectedThread(threads[0].id)
            })
    }, [])

    return (
        <div>
            {threads ? (
                <Threads
                    threads={threads}
                    changeThread={setSelectedThread}
                    createThread={(e) => {
                        console.log(e)
                    }}
                />
            ) : null}

            {selectedThread ? <Thread id={selectedThread} /> : null}
        </div>
    )
}

;(async () => {
    ReactDOM.render(<UI />, document.body)
})()
