// /**
//  * A Controller interface around workers. The worker is running to handle
//  * input -> output mapping and you can give the execute method and input and
//  * get the output.
//  */
// export class Controller {
//
//
//     // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
//
//     public execute<I, O>(input: I): Promise<O> {
//
//         return new Promise<O>(((resolve, reject) => {
//
//             const id = this.sequence++;
//
//             this.jobs[id] = {
//                 id,
//                 resolve,
//                 reject
//             };
//
//         }));
//
//     }
//
// }
//
// class JobQueue<Out> {
//
//     private sequence: number = 0;
//
//     private jobs: {[id: number]: Job<Out>} = {};
//
//     public get(id: number): Job<Out> | undefined {
//         return this.jobs[id];
//     }
//
//     public add(job: Job<Out>) {
//         this.jobs[job.id] = job;
//     }
//
// }
//
// export interface Job<Out> {
//
//     readonly id: number;
//     readonly resolve: (resolved: Out) => void;
//     readonly reject: (err: Error) => void;
//
// }
