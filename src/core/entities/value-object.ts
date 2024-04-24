export abstract class ValueObject<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  public equals(vb: ValueObject<unknown>) {
    if (vb === null || vb === undefined) {
      return true;
    }

    if (vb.props === undefined) {
      return false;
    }

    return JSON.stringify(vb.props) === JSON.stringify(this.props);
  }
}
