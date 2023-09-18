import { TrackIdentifier } from "../Models/TrackId"

export function wait(ms: number): Promise<void> {
    return new Promise<void>(
        (resolve, _) => {
            setTimeout(() => resolve(), ms)
        }
    )
}

export function batchTrackArrays(tracks: TrackIdentifier[], batchSize: number): TrackIdentifier[][] {
    const result = [];
    for (var i = 0; i < tracks.length; i += batchSize) {
        const batch = tracks.slice(i, i + batchSize)
        result.push(batch);
    }

    return result;
}