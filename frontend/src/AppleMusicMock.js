export let baseObject = {
    responseRoot: {
        data: {
            libraryPlaylist: {
                attributes: {
                    artwork: "",
                    description: "",
                    name: "",
                    playParams: "",
                    canEdit: ""
                },
                relationships: {
                    tracks: {
                        data: {
                            attributes: {
                                albumName: "",
                                artistName: "",
                                artwork: "",
                                name: "",
                                durationInMillis: 0
                            },
                            relationships: {}
                        }
                    }
                }
            }
        }
    }
}

export let letItBe = {
    responseRoot: {
        data: {
            libraryPlaylist: {
                attributes: {
                    artwork: "",
                    description: "",
                    name: "",
                    playParams: "",
                    canEdit: ""
                },
                relationships: {
                    tracks: {
                        data: {
                            attributes: {
                                albumName: "Let it Be",
                                artistName: "The Beatles",
                                artwork: "",
                                name: "Let it Be",
                                durationInMillis: 0
                            },
                            relationships: {}
                        }
                    }
                }
            }
        }
    }
}