// DocumentCheckSystem — the stateless truth oracle for field comparison
// and flag validation. SYSTEM_SKELETON.md §3.2 (DocumentVerificationSystem).

import { Case, FieldId, Flag, GameDocument } from '../types';

export enum CompareResult {
  MATCH = 'MATCH',
  MISMATCH = 'MISMATCH',
}

export class DocumentCheckSystem {
  /** Compare a document field against the DB record's value for the same FieldId. */
  compareWithRecord(c: Case, docIndex: number, fieldIndex: number): CompareResult {
    const doc = this.docAt(c, docIndex);
    const field = this.fieldAt(doc, fieldIndex);
    if (!c.dbQueried) {
      throw new Error('compareWithRecord: DB record not queried yet (QUERY first)');
    }
    const recordValue = c.dbRecord.fields[field.id];
    if (recordValue === undefined) return CompareResult.MATCH; // record silent on this field
    return recordValue === field.value ? CompareResult.MATCH : CompareResult.MISMATCH;
  }

  /** Compare two fields across two documents of the same case. */
  compareAcrossDocs(
    c: Case,
    docA: number,
    fieldA: number,
    docB: number,
    fieldB: number,
  ): CompareResult {
    const a = this.fieldAt(this.docAt(c, docA), fieldA);
    const b = this.fieldAt(this.docAt(c, docB), fieldB);
    if (a.id !== b.id) return CompareResult.MISMATCH; // comparing unlike fields is itself a mismatch signal
    return a.value === b.value ? CompareResult.MATCH : CompareResult.MISMATCH;
  }

  /**
   * Build a Flag with generation-truth validity computed at file time:
   * valid iff it cites an actually-altered field; lag-safe address
   * mismatches are marked (audit weight 0).
   */
  buildFlag(c: Case, docIndex: number, fieldIndex: number): Flag {
    const doc = this.docAt(c, docIndex);
    const field = this.fieldAt(doc, fieldIndex);
    const citesAltered = doc.isForged && doc.alteredFieldIdx.includes(fieldIndex);
    const lagSafe =
      c.dbRecord.lagSafe.includes(field.id) && !citesAltered;
    return {
      docIndex,
      fieldIndex,
      againstFieldId: field.id,
      validAtAudit: citesAltered,
      lagSafe,
    };
  }

  /** Is the whole case clean of forgeries? (audit-side truth) */
  caseIsClean(c: Case): boolean {
    return !c.documents.some((d) => d.isForged);
  }

  private docAt(c: Case, i: number): GameDocument {
    const d = c.documents[i];
    if (!d) throw new Error(`DocumentCheckSystem: no document at index ${i} on ${c.id}`);
    return d;
  }

  private fieldAt(doc: GameDocument, i: number) {
    const f = doc.fields[i];
    if (!f) throw new Error(`DocumentCheckSystem: no field at index ${i} on ${doc.type}`);
    return f;
  }
}
