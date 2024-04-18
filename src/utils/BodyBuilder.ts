export function bodyBuild(work: number, carry: number, move: number): BodyPartConstant[] {
    const body: BodyPartConstant[] = [];
    for (let i = 0; i < work; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < carry; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < move; i++) {
        body.push(MOVE);
    }
    return body;
}
