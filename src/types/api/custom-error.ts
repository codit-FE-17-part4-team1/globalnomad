export class CustomError extends Error {
  status?: number;
  method?: string;
  url?: string;
  constructor(opts: {
    status?: number;
    message: string;
    method?: string;
    url?: string;
  }) {
    super(opts.message);
    this.name = 'CustomError';
    Object.assign(this, opts);
  }
}

// export const parseSchema = z.object({
//   message: z.string(),
// });

// export type parseType = z.infer<typeof parseSchema>;

// export class CustomError extends Error {
//   constructor(
//     message?: string,
//     public status?: number,

//     public details?: parseType
//   ) {
//     super(message);
//     this.name = this.constructor.name;
//   }
// }
